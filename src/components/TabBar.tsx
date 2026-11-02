import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "./AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../theme";
import { useTranslation } from "react-i18next";

export type TabKey = "inicio" | "mercado" | "buscar" | "panel" | "perfil";

type IconName = ComponentProps<typeof Ionicons>["name"];

const TABS: { key: TabKey; label: string; icon: IconName; iconActive: IconName }[] = [
  { key: "inicio", label: "tabs.home", icon: "home-outline", iconActive: "home" },
  { key: "mercado", label: "tabs.market", icon: "briefcase-outline", iconActive: "briefcase" },
  { key: "buscar", label: "tabs.search", icon: "search-outline", iconActive: "search" },
  { key: "panel", label: "tabs.panel", icon: "stats-chart-outline", iconActive: "stats-chart" },
  { key: "perfil", label: "tabs.profile", icon: "person-outline", iconActive: "person" },
];

type Props = {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  showPanel: boolean;
};

export default function TabBar({ active, onChange, showPanel }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {TABS.filter((tab) => showPanel || tab.key !== "panel").map((tab) => {
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
              {t(tab.label)}
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
