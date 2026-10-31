import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { COLORS, FONT, RADIUS } from "../theme";
import Text from "./AppText";

type Props = TextInputProps & { label: string };

// Campo de texto con etiqueta (formularios).
export default function Field({ label, style, ...props }: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={COLORS.subtle}
        {...props}
        style={[styles.input, style]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "500", color: COLORS.ink, marginBottom: 6 },
  input: {
    fontFamily: FONT.regular,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.ink,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
});
