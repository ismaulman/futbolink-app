import { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { COLORS, RADIUS } from "../theme";
import Text from "./AppText";

type Props = { title: string; onBack: () => void; right?: ReactNode };

// Cabecera de pantallas secundarias: flecha atrás + título.
export default function ScreenHeader({ title, onBack, right }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onBack} style={styles.back} hitSlop={6}>
        <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      {right && <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  back: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  right: { marginLeft: "auto", paddingRight: 4 },
  title: { fontSize: 17, fontWeight: "500", color: COLORS.ink },
});
