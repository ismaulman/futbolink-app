import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "./AppText";
import { COLORS, RADIUS } from "../theme";
import { useTranslation } from "react-i18next";

type Props = {
  initials: string;
  onAvatar: () => void;
  onSearch: () => void;
};

// Barra superior estilo LinkedIn: avatar, buscador y mensajes.
export default function TopBar({ initials, onAvatar, onSearch }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.bar}>
      <Pressable onPress={onAvatar} style={styles.avatar} accessibilityLabel={t("top.myProfile")}>
        <Text style={styles.avatarText}>{initials}</Text>
      </Pressable>

      <Pressable onPress={onSearch} style={styles.search}>
        <Ionicons name="search-outline" size={16} color={COLORS.muted} />
        <Text style={styles.searchText}>{t("top.search")}</Text>
      </Pressable>

      <Pressable hitSlop={10} accessibilityLabel={t("top.messages")}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 13, color: COLORS.primaryDark, fontWeight: "500" },
  search: {
    flex: 1,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.divider,
  },
  searchText: { fontSize: 14, color: COLORS.muted },
});
