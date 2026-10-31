import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import { MOCK_NEWS, NEWS_CATEGORIES, NewsItem } from "../explore";
import { COLORS, RADIUS } from "../theme";

// Noticias de FutboLink con filtro por categoría y lectura dentro de la app.
export default function NoticiasScreen() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState("");
  const [open, setOpen] = useState<NewsItem | null>(null);

  const fmt = (date: string) =>
    new Date(date).toLocaleDateString(i18n.language, { day: "numeric", month: "long", year: "numeric" });

  if (open) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setOpen(null)} style={styles.back} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
          <Text style={styles.backText}>{t("news.back")}</Text>
        </Pressable>
        <Text style={styles.category}>{t(`news.cat_${open.category}`)}</Text>
        <Text style={styles.title}>{open.title}</Text>
        <Text style={styles.meta}>{fmt(open.date)}</Text>
        {open.body.map((paragraph, i) => (
          <Text key={i} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>
    );
  }

  const items = MOCK_NEWS.filter((n) => !category || n.category === category);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.chips}>
        {["", ...NEWS_CATEGORIES].map((key) => (
          <Pressable
            key={key || "all"}
            onPress={() => setCategory(key)}
            style={[styles.chip, category === key && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === key && styles.chipTextActive]}>
              {key ? t(`news.cat_${key}`) : t("common.all")}
            </Text>
          </Pressable>
        ))}
      </View>
      {items.length === 0 && <Text style={styles.meta}>{t("news.empty")}</Text>}
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => setOpen(item)}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: COLORS.surface }]}
        >
          <Text style={styles.category}>{t(`news.cat_${item.category}`)}</Text>
          <Text style={styles.rowTitle}>{item.title}</Text>
          <Text style={styles.summary}>{item.summary}</Text>
          <Text style={styles.meta}>{fmt(item.date)}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
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
  row: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  category: { fontSize: 12, color: COLORS.primaryDark, fontWeight: "500", marginBottom: 4 },
  rowTitle: { fontSize: 16, color: COLORS.ink, lineHeight: 22 },
  summary: { fontSize: 14, color: COLORS.muted, marginTop: 4, lineHeight: 20 },
  meta: { fontSize: 12, color: COLORS.subtle, marginTop: 6 },
  back: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, color: COLORS.ink },
  title: { fontSize: 22, fontWeight: "500", color: COLORS.ink, lineHeight: 29 },
  paragraph: { fontSize: 15, color: COLORS.ink, lineHeight: 24, marginTop: 14 },
});
