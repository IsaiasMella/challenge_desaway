import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, StyleSheet, View, Text, Alert } from "react-native";

import Card from "../components/Card";
import TextInputField from "../components/TextInputField";
import DropdownField from "../components/DropdownField";
import PrimaryButton from "../components/PrimaryButton";

import { useHarvestForm } from "../hooks/useHarvestForm";

import { WEIGHT_OPTIONS, PLACEHOLDERS } from "../constants/form.constants";
import type { CropOption } from "../types/harvest.types";

import { PDFGeneratorService } from "../services/PDFGeneratorService";

export default function App() {
  const {
    formData,
    errors,
    handleFieldChange,
    handleSubmit,
    resetForm,
    tonsInput,
    isLoaded,
  } = useHarvestForm();

  const onGeneratePDF = async () => {
    const pdfData = await handleSubmit();
    if (!pdfData) return;

    try {
      const result = await PDFGeneratorService.generateHarvestPDF(pdfData);

      Alert.alert(
        "PDF generado exitosamente",
        `El PDF se guardó en:\n${result.location}\n\nArchivo: ${result.fileName}`,
        [
          {
            text: "OK",
            onPress: resetForm,
          },
        ]
      );
    } catch (error: any) {
      Alert.alert("Error", `No se pudo generar el PDF: ${error.message}`);
      console.error("PDF generation error:", error);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <Text style={styles.loadingText}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <Card>
          <Text style={styles.title}>Generar PDF de Cosecha</Text>

          <View style={styles.inputsContainer}>
            <TextInputField
              label="Nombre completo"
              value={formData.full_name}
              onChangeText={(text) => handleFieldChange("full_name", text)}
              placeholder={PLACEHOLDERS.full_name}
              error={errors.full_name}
              required
            />

            <DropdownField<string>
              label="Cosecha"
              value={formData.crop}
              onValueChange={(value) => handleFieldChange("crop", value)}
              options={WEIGHT_OPTIONS}
              error={errors.crop}
            />

            <TextInputField
              label="Toneladas cosechadas"
              value={tonsInput}
              onChangeText={(text) => handleFieldChange("tons", text)}
              placeholder={PLACEHOLDERS.detail}
              error={errors.tons}
              keyboardType="decimal-pad"
              required
            />
          </View>

          <PrimaryButton title="Generar PDF" onPress={onGeneratePDF} />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#A08AEC" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4D406E",
    textAlign: "center",
    marginBottom: 20,
  },
  inputsContainer: { width: "100%", gap: 20 },
  loadingText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
  },
});
