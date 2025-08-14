import AsyncStorage from "@react-native-async-storage/async-storage";
import type { HarvestData } from "../types/harvest.types";

const FORM_DATA_KEY = "@harvest:formData";

export const FormStorageService = {
  // Guardar datos del formulario
  async saveFormData(data: Partial<HarvestData>): Promise<void> {
    try {
      await AsyncStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn("Error saving form data:", error);
    }
  },

  // Cargar datos del formulario
  async loadFormData(): Promise<Partial<HarvestData> | null> {
    try {
      const raw = await AsyncStorage.getItem(FORM_DATA_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as Partial<HarvestData>;
    } catch (error) {
      console.warn("Error loading form data:", error);
      return null;
    }
  },

  // Limpiar datos del formulario
  async clearFormData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FORM_DATA_KEY);
    } catch (error) {
      console.warn("Error clearing form data:", error);
    }
  },
};

export default FormStorageService;