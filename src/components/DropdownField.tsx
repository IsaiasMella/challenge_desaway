import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Entypo from "@expo/vector-icons/Entypo";

interface DropdownOption<T = string> {
  label: string;
  value: T;
}

interface DropdownFieldProps<T = string> {
  label: string;
  value: T | null;
  onValueChange: (value: T | null) => void;
  options: DropdownOption<T>[];
  error?: string;
}

function DropdownField<T extends string>({
  label,
  value,
  onValueChange,
  options,
  error,
}: DropdownFieldProps<T>) {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={value}
          onValueChange={onValueChange}
          mode="dropdown"
          dropdownIconColor="#ffffff"
          dropdownIconRippleColor="transparent"
        >
          <Picker.Item
            style={styles.pikerItem}
            label="Seleccione una cosecha"
            value={null}
            color="#999999"
          />
          
          {options.map((option) => (
            <Picker.Item
              style={styles.pikerItem}
              key={String(option.value)}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>

        <View style={styles.arrowContainer} pointerEvents="none">
          <Entypo name="chevron-down" size={16} color="#4D406E" />
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputWrapper: {
    width: "100%",
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4D406E",
  },
  pickerWrapper: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    minHeight: 48,
    justifyContent: "center",
    overflow: "visible",
  },
  picker: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  pikerItem: {
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  arrowContainer: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    elevation: 2,
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default DropdownField;