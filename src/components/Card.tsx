import { FC } from "react";
import { View, StyleSheet, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

const Card: FC<CardProps> = ({ children, style, ...restProps }) => {
  return (
    <View style={[styles.card, style]} {...restProps}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FCFBFF",
    borderRadius: 25,
    padding: 25,
    width: 275,
    alignItems: "center",
    gap: 20,
  },
});

export default Card;