import type { HarvestData, FormErrors } from "../types/harvest.types";
import { ERROR_MESSAGES } from "../constants/form.constants";

type ValidationResult = { isValid: boolean; errors: FormErrors };

export const validateHarvestForm = (data: HarvestData): ValidationResult => {
  const errors: FormErrors = { full_name: "", tons: "" };

  const rawName = (data.full_name ?? "").trim();
  if (!rawName) {
    errors.full_name = ERROR_MESSAGES.fullNameRequired;
  } else {
    const lettersOnly = rawName.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
    if (lettersOnly.length <= 3) {
      errors.full_name = ERROR_MESSAGES.fullNameTooShort; 
    }
  }

  const tons =
    typeof data.tons === "number" ? data.tons : parseFloat(String(data.tons));
  if (Number.isNaN(tons)) {
    errors.tons = ERROR_MESSAGES.tonsRequired;
  } else if (tons <= 0) {
    errors.tons = ERROR_MESSAGES.tonsMustBeGreaterThanZero;
  }

  const isValid = !errors.full_name && !errors.tons;
  return { isValid, errors };
};
