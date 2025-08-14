
export interface HarvestData {
  full_name: string;
  crop: CropOption;
  tons: number;
  date?: Date; 
}

export type CropOption = "Soja" | "Maiz" | "Trigo" | "Girasol" | "Cebada";

export interface CropPickerOption {
  label: string;
  value: CropOption;
}

export interface FormErrors {
  full_name: string;
  tons: string;
}
