import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { COLORS, FONT, RADIUS } from "../theme";

const SUPPORT_EMAIL = "futbolink.contacto@gmail.com";

// Preguntas del Centro de ayuda de la web (sin la parte de suscripciones y pagos,
// que se gestiona en la web).
const CATEGORIES: { key: string; count: number }[] = [
  { key: "profile", count: 8 },
  { key: "offers", count: 7 },
  { key: "recruiting", count: 5 },
  { key: "safety", count: 5 },
];

type Props = { onBack: () => void };

export default function HelpScreen({ onBack }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(
    () =>
      CATEGORIES.flatMap((c) =>
        Array.from({ length: c.count }, (_, i) => ({
          id: `${c.key}.${i + 1}`,
          category: c.key,
          q: t(`help.${c.key}.${i + 1}.q`),
          a: t(`help.${c.key}.${i + 1}.a`),
        })),
      ),
    [t],
  );

  const needle = query.trim().toLowerCase();
  const visible = items.filter(
    (it) =>
      (category === "ALL" || it.category === category) &&
      (!needle || it.q.toLowerCase().includes(needle) || it.a.toLowerCase().includes(needle)),
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("help.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.search}>
          <Ionicons name="search-outline" size={18} color={COLORS.subtle} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("help.search")}
            placeholderTextColor={COLORS.subtle}
            style={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {["ALL", ...CATEGORIES.map((c) => c.key)].map((key) => {
            const active = category === key;
            return (
              <Pressable key={key} onPress={() => setCategory(key)} style={styles.filter}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {key === "ALL" ? t("apps.filterAll") : t(`help.cat.${key}`)}
                </Text>
                <View style={[styles.underline, active && styles.underlineActive]} />
              </Pressable>
            );
          })}
        </ScrollView>

        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t("help.noResultsTitle")}</Text>
            <Text style={styles.emptyText}>{t("help.noResultsText")}</Text>
          </View>
        ) : (
          visible.map((it) => {
            const open = openId === it.id;
            return (
              <View key={it.id} style={styles.item}>
                <Pressable onPress={() => setOpenId(open ? null : it.id)} style={styles.question}>
                  <Text style={styles.questionText}>{it.q}</Text>
                  <Ionicons name={open ? "chevron-up" : "chevron-down"} size={18} color={COLORS.subtle} />
                </Pressable>
                {open && <Text style={styles.answer}>{it.a}</Text>}
              </View>
            );
          })
        )}

        <View style={styles.support}>
          <Text style={styles.supportTitle}>{t("help.stillNeed")}</Text>
          <Text style={styles.supportText}>{t("help.stillNeedText")}</Text>
          <Pressable onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)} style={styles.cta}>
            <Text style={styles.ctaText}>{t("help.contact")}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { paddingBottom: 32 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.ink, fontFamily: FONT.regular },
  filters: { paddingHorizontal: 16, gap: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filter: { paddingTop: 4 },
  filterText: { fontSize: 14, color: COLORS.muted, paddingBottom: 8 },
  filterTextActive: { color: COLORS.ink, fontWeight: "500" },
  underline: { height: 2, backgroundColor: "transparent" },
  underlineActive: { backgroundColor: COLORS.primary },
  item: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  question: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 16, paddingVertical: 16 },
  questionText: { flex: 1, fontSize: 15, fontWeight: "500", color: COLORS.ink },
  answer: { fontSize: 14, lineHeight: 21, color: COLORS.muted, paddingHorizontal: 16, paddingBottom: 16 },
  empty: { alignItems: "center", padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  emptyText: { fontSize: 13, color: COLORS.muted, marginTop: 6, textAlign: "center" },
  support: { alignItems: "center", padding: 24, marginTop: 8 },
  supportTitle: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  supportText: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  cta: { marginTop: 16, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 12 },
  ctaText: { color: "#fff", fontWeight: "500", fontSize: 14 },
});
