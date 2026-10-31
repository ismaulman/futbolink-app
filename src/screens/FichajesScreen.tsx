import { useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import { MOCK_SIGNINGS, Signing } from "../explore";
import { tc } from "../i18n";
import { COLORS, FONT, RADIUS } from "../theme";

type Tab = "latest" | "views" | "loans" | "free";
const TABS: Tab[] = ["latest", "views", "loans", "free"];

// Fichajes confirmados por las dos partes: traspasos, cesiones y agentes libres.
export default function FichajesScreen() {
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<Tab>("latest");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  let items: Signing[] = MOCK_SIGNINGS.filter((s) => {
    if (tab === "loans" && s.type !== "CESION") return false;
    if (tab === "free" && s.type !== "LIBRE") return false;
    if (!query) return true;
    return [s.playerName, s.fromClub ?? "", s.toClub].some((v) => v.toLowerCase().includes(query));
  });
  items = [...items].sort((a, b) => (tab === "views" ? b.views - a.views : b.date.localeCompare(a.date)));

  const fmt = (date: string) =>
    new Date(date).toLocaleDateString(i18n.language, { day: "numeric", month: "short" });

  return (
    <FlatList
      data={items}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t("signings.search")}
            placeholderTextColor={COLORS.subtle}
            style={styles.search}
          />
          <View style={styles.tabs}>
            {TABS.map((key) => (
              <Pressable
                key={key}
                onPress={() => setTab(key)}
                style={[styles.chip, tab === key && styles.chipActive]}
              >
                <Text style={[styles.chipText, tab === key && styles.chipTextActive]}>
                  {t(`signings.tab_${key}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>{t("signings.empty")}</Text>}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <View style={styles.rowTop}>
            <Text style={styles.name}>{item.playerName}</Text>
            <Text style={styles.type}>{t(`signings.type_${item.type}`)}</Text>
          </View>
          <Text style={styles.meta}>
            {tc(item.position)} · {t("player.age", { count: item.age })}
          </Text>
          <Text style={styles.move}>
            {item.fromClub ?? t("signings.freeAgent")} → {item.toClub}
          </Text>
          <Text style={styles.meta}>
            {item.flag} {tc(item.toCountry)} · {fmt(item.date)}
            {item.agency ? ` · ${item.agency}` : ""}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  search: {
    fontFamily: FONT.regular,
    height: 40,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.ink,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  tabs: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primaryBorder },
  chipText: { fontSize: 13, color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark, fontWeight: "500" },
  empty: { fontSize: 14, color: COLORS.muted, marginTop: 16 },
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 16, color: COLORS.ink, flex: 1 },
  type: { fontSize: 12, color: COLORS.primaryDark, fontWeight: "500" },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  move: { fontSize: 14, color: COLORS.ink, marginTop: 6 },
});
