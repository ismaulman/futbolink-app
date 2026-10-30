import { StyleSheet, Text, TextProps } from "react-native";
import { FONT } from "../theme";

// Text con Inter. React Native no mezcla fontWeight con fuentes propias,
// así que traducimos el peso al archivo de fuente correspondiente.
export default function AppText({ style, ...props }: TextProps) {
  const flat = StyleSheet.flatten(style) ?? {};
  const weight = String(flat.fontWeight ?? "400");
  const fontFamily =
    weight === "600" || weight === "700" || weight === "800" || weight === "bold"
      ? FONT.semibold
      : weight === "500"
        ? FONT.medium
        : FONT.regular;
  return <Text {...props} style={[style, { fontFamily, fontWeight: "normal" }]} />;
}
