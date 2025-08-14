import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ANDROID_DIR_KEY = "@harvest_pdf_dir_uri";

export class PDFSaveService {
  static async savePDF(base64: string, fileName: string) {
    if (Platform.OS === "android") {
      return await this.saveToAndroidPublicDir(base64, fileName);
    } else {
      // iOS: guarda AUTOMÁTICO en Archivos → En mi iPhone → <Tu App>
      return await this.saveToIOSFilesContainer(base64, fileName);
    }
  }

  // ---------- ANDROID: guardar en carpeta pública (persistiendo la elección del usuario) ----------
  private static async saveToAndroidPublicDir(base64: string, fileName: string) {
    try {
      // 1) Leer carpeta persistida
      let dirUri = await AsyncStorage.getItem(ANDROID_DIR_KEY);

      // 2) Si no hay carpeta guardada, pedirla una única vez (sugerir al usuario Documents/Download)
      if (!dirUri) {
        const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!perm.granted || !perm.directoryUri) {
          throw new Error("Permisos denegados para elegir carpeta pública.");
        }
        dirUri = perm.directoryUri;
        await AsyncStorage.setItem(ANDROID_DIR_KEY, dirUri);
      }

      // 3) Crear archivo y escribir Base64 directo
      const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
        dirUri,
        fileName,
        "application/pdf"
      );

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        fileName,
        location: "Carpeta pública (Android SAF)",
        fullPath: fileUri, // content://...
      };
    } catch (err: any) {
      // Fallback: compartir (por si el OEM rompe SAF o el permiso fue revocado)
      try {
        const tempPath = FileSystem.cacheDirectory! + fileName;
        await FileSystem.writeAsStringAsync(tempPath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(tempPath, {
            mimeType: "application/pdf",
            dialogTitle: "Guardar PDF",
          });
        }
        return {
          fileName,
          location: "Guardado vía selector (fallback Android)",
          fullPath: tempPath,
        };
      } catch (fallbackError: any) {
        throw new Error(`No se pudo guardar el PDF (Android): ${fallbackError.message || fallbackError}`);
      }
    }
  }

  // ---------- iOS: guardar en carpeta de la app visible en Archivos ----------
  private static async saveToIOSFilesContainer(base64: string, fileName: string) {
    // Requiere app.json → UIFileSharingEnabled + LSSupportsOpeningDocumentsInPlace = true
    try {
      // Opcional: subcarpeta "Reports" dentro de la carpeta de la app
      const baseDir = FileSystem.documentDirectory!; // .../Library/LocalDocuments/
      const reportsDir = baseDir + "Reports/";
      const reportsInfo = await FileSystem.getInfoAsync(reportsDir);
      if (!reportsInfo.exists) {
        await FileSystem.makeDirectoryAsync(reportsDir, { intermediates: true });
      }

      const filePath = reportsDir + fileName;
      await FileSystem.writeAsStringAsync(filePath, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // No abrimos share sheet: queda guardado automáticamente y accesible en Archivos.
      // Ruta para el usuario: Archivos → En mi iPhone → <Tu App> → Reports → <archivo.pdf>
      return {
        fileName,
        location: "Archivos → En mi iPhone → <Tu App> → Reports",
        fullPath: filePath, // file://...
      };
    } catch (err: any) {
      // Fallback: compartir para que el usuario elija "Guardar en Archivos"
      try {
        const tempPath = FileSystem.cacheDirectory! + fileName;
        await FileSystem.writeAsStringAsync(tempPath, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(tempPath, {
            mimeType: "application/pdf",
            dialogTitle: "Guardar PDF",
          });
        }
        return {
          fileName,
          location: "Guardado vía compartir (fallback iOS)",
          fullPath: tempPath,
        };
      } catch (fallbackError: any) {
        throw new Error(`No se pudo guardar el PDF (iOS): ${fallbackError.message || fallbackError}`);
      }
    }
  }
}