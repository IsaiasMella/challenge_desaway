import { FC } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface TextInputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
}

const TextInputField: FC<TextInputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  placeholder,
  ...restProps
}) => {
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {label} {required && "*"}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.inputContainer}
        placeholder={placeholder}
        placeholderTextColor="#999"
        {...restProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

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
  inputContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  errorText: {
    color: "red",
    fontSize: 10,
  },
});

export default TextInputField;