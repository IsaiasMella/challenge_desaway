import { useState, useEffect, useCallback } from "react";
import type { HarvestData, CropOption } from "../types/harvest.types";
import { FormStorageService } from "../services/formStorageService";

type FormErrors = {
  full_name?: string;
  crop?: string;
  tons?: string;
};

type FormData = {
  full_name: string;
  crop: CropOption | null;
  tons: number;
};

export const useHarvestForm = () => {
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    crop: null,
    tons: 0,
  });

  const [tonsInput, setTonsInput] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await FormStorageService.loadFormData();
        if (savedData) {
          setFormData({
            full_name: savedData.full_name || "",
            crop: savedData.crop || null,
            tons: savedData.tons || 0,
          });
          if (savedData.tons !== undefined && savedData.tons !== 0) {
            setTonsInput(savedData.tons.toString().replace(".", ","));
          }
        }
      } catch (error) {
        console.warn("Error loading saved form data:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadSavedData();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const timeoutId = setTimeout(async () => {
      const dataToSave: Partial<HarvestData> = {
        full_name: formData.full_name || undefined,
        crop: formData.crop || undefined,
        tons: formData.tons || undefined,
      };

      if (dataToSave.full_name || dataToSave.crop || dataToSave.tons) {
        await FormStorageService.saveFormData(dataToSave);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, isLoaded]);

  const handleFieldChange = useCallback((field: string, value: any) => {
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    if (field === "tons") {
      const regex = /^[0-9]*[,.]?[0-9]*$/;
      
      if (regex.test(value) || value === "") {
        setTonsInput(value);
        const numericValue = Number(value.replace(",", "."));
        setFormData(prev => ({ ...prev, tons: isNaN(numericValue) ? 0 : numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, [errors]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "El nombre completo es requerido";
    }

    if (!formData.crop) {
      newErrors.crop = "Debe seleccionar un tipo de cosecha";
    }

    if (formData.tons <= 0) {
      newErrors.tons = "Las toneladas deben ser mayor a 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<HarvestData | null> => {
    if (!validateForm()) {
      return null;
    }

    return {
      full_name: formData.full_name.trim(),
      crop: formData.crop!,
      tons: formData.tons,
    };
  };

  const resetForm = useCallback(async () => {
    setFormData({
      full_name: "",
      crop: null,
      tons: 0,
    });
    setTonsInput("");
    setErrors({});
    await FormStorageService.clearFormData();
  }, []);

  return {
    formData,
    errors,
    handleFieldChange,
    handleSubmit,
    resetForm,
    tonsInput,
    isLoaded,
  };
};