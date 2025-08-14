
import type { CropPickerOption } from "../types/harvest.types";

export const WEIGHT_OPTIONS: CropPickerOption[] = [
  { label: "Soja", value: "Soja" },
  { label: "Maiz", value: "Maiz" },
  { label: "Trigo", value: "Trigo" },
  { label: "Girasol", value: "Girasol" },
  { label: "Cebada", value: "Cebada" },
];

export const DEFAULT_WEIGHT = "Soja";

export const PLACEHOLDERS = {
  full_name: "E.g: Juan",
  detail: "Additional notes",
};

export const ERROR_MESSAGES = {
  fullNameRequired: "El nombre es requerido.",
  fullNameTooShort: "El nombre debe tener más de 3 letras.",
  cropRequired: "Selecciona una cosecha",
  tonsRequired: "Las toneladas son requeridas.",
  tonsMustBeGreaterThanZero: "Las toneladas deben ser mayores a 0.",
};
