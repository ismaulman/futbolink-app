import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { SUCCESS_CASES, SuccessCase } from "../successCases";
import { COLORS, RADIUS } from "../theme";

type Props = { onBack: () => void };

// Casos de éxito: lista de historias y detalle con anterior/siguiente, como la web.
export default function SuccessCasesScreen({ onBack }: Props) {
  const { t } = useTranslation();
  const [index, setIndex] = useState<number | null>(null);

  if (index !== null) {
    const item = SUCCESS_CASES[index];
    const prev = index > 0 ? index - 1 : null;
    const next = index < SUCCESS_CASES.length - 1 ? index + 1 : null;
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t("success.eyebrow")} onBack={() => setIndex(null)} />
        <ScrollView contentContainerStyle={styles.detail} showsVerticalScrollIndicator={false}>
          <Image source={item.image} style={styles.hero} resizeMode="cover" />
          <Text style={styles.badge}>{t("success.badge")}</Text>
          <Text style={styles.name}>
            {item.name} {item.flag}
          </Text>
          <Text style={styles.role}>{item.role}</Text>
          <Text style={styles.quote}>“{item.testimonial}”</Text>
          <View style={styles.nav}>
            <Pressable disabled={prev === null} onPress={() => prev !== null && setIndex(prev)} style={[styles.navBtn, prev === null && styles.navOff]}>
              <Ionicons name="chevron-back" size={16} color={COLORS.ink} />
              <Text style={styles.navText}>{t("success.prev")}</Text>
            </Pressable>
            <Pressable disabled={next === null} onPress={() => next !== null && setIndex(next)} style={[styles.navBtn, next === null && styles.navOff]}>
              <Text style={styles.navText}>{t("success.next")}</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.ink} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("success.kicker")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t("success.title")}</Text>
        <Text style={styles.subtitle}>{t("success.subtitle")}</Text>
        {SUCCESS_CASES.map((item: SuccessCase, i) => (
          <Pressable key={item.id} onPress={() => setIndex(i)} style={styles.card}>
            <Image source={item.image} style={styles.photo} resizeMode="cover" />
            <View style={styles.cardBody}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name} {item.flag}
              </Text>
              <Text style={styles.cardRole} numberOfLines={1}>
                {item.role}
              </Text>
              <Text style={styles.cardQuote} numberOfLines={3}>
                “{item.testimonial}”
              </Text>
              <Text style={styles.cta}>{t("success.view")} →</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  list: { padding: 16, paddingBottom: 32 },
  title: { fontSize: 20, fontWeight: "500", color: COLORS.ink },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 6, marginBottom: 16, lineHeight: 20 },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginBottom: 14,
    backgroundColor: COLORS.surface,
  },
  photo: { width: "100%", height: 200, backgroundColor: COLORS.divider },
  cardBody: { padding: 14 },
  cardName: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  cardRole: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  cardQuote: { fontSize: 14, color: COLORS.ink, marginTop: 10, lineHeight: 20 },
  cta: { fontSize: 14, fontWeight: "500", color: COLORS.primaryDark, marginTop: 10 },
  detail: { paddingBottom: 32 },
  hero: { width: "100%", height: 320, backgroundColor: COLORS.divider },
  badge: { fontSize: 12, fontWeight: "500", color: COLORS.primaryDark, marginTop: 16, paddingHorizontal: 16 },
  name: { fontSize: 22, fontWeight: "500", color: COLORS.ink, marginTop: 4, paddingHorizontal: 16 },
  role: { fontSize: 14, color: COLORS.muted, marginTop: 2, paddingHorizontal: 16 },
  quote: { fontSize: 17, lineHeight: 26, color: COLORS.ink, marginTop: 16, paddingHorizontal: 16 },
  nav: { flexDirection: "row", justifyContent: "space-between", marginTop: 28, paddingHorizontal: 16 },
  navBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
  },
  navOff: { opacity: 0.35 },
  navText: { fontSize: 13, color: COLORS.ink },
});
