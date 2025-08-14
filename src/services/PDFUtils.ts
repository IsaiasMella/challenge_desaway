import { PDFDocument, PDFFont, PDFImage } from "pdf-lib";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

export class PDFUtils {
  // ---------- util: timestamp ----------
  static timestamp() {
    // 2025-08-13_12-34-56
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(
      d.getMinutes()
    )}-${pad(d.getSeconds())}`;
  }

  // ---------- wrap text by width ----------
  static wrapByWidth(text: string, font: PDFFont, size: number, maxWidth: number) {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = "";
    for (const w of words) {
      const cand = cur ? `${cur} ${w}` : w;
      if (font.widthOfTextAtSize(cand, size) <= maxWidth) cur = cand;
      else {
        if (cur) lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  // ---------- try embed PNG ----------
  static async tryEmbedPng(pdf: PDFDocument, req: () => number): Promise<PDFImage | undefined> {
    try {
      const asset = Asset.fromModule(req());
      await asset.downloadAsync();
      if (!asset.localUri) return undefined;
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return await pdf.embedPng(base64);
    } catch {
      return undefined;
    }
  }
}