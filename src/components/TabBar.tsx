import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../theme";

export type TabKey = "mercado" | "buscar" | "perfil";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TABS: { key: TabKey; label: string; icon: IconName; iconActive: IconName }[] = [
  { key: "mercado", label: "Mercado", icon: "briefcase-outline", iconActive: "briefcase" },
  { key: "buscar", label: "Buscar", icon: "search-outline", iconActive: "search" },
  { key: "perfil", label: "Perfil", icon: "person-outline", iconActive: "person" },
];

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
};

export default function TabBar({ active, onChange }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={22}
              color={isActive ? COLORS.primary : COLORS.subtle}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  label: { fontSize: 11, color: COLORS.muted, fontWeight: "500" },
  labelActive: { color: COLORS.primary },
});
