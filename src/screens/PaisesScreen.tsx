import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import { Offer } from "../data";
import { tc } from "../i18n";
import { COLORS } from "../theme";

type Props = { offers: Offer[]; onOpenOffer: (offer: Offer) => void };

// Mercado por país: dónde hay más ofertas abiertas y en cuántas ligas.
export default function PaisesScreen({ offers: allOffers, onOpenOffer }: Props) {
  const { t } = useTranslation();
  const [country, setCountry] = useState<string | null>(null);

  const countries = useMemo(() => {
    const map = new Map<string, { flag: string; offers: Offer[] }>();
    for (const offer of allOffers) {
      const entry = map.get(offer.country) ?? { flag: offer.flag, offers: [] };
      entry.offers.push(offer);
      map.set(offer.country, entry);
    }
    return Array.from(map.entries())
      .map(([name, { flag, offers }]) => ({
        name,
        flag,
        offers,
        leagues: new Set(offers.map((o) => o.league)).size,
      }))
      .sort((a, b) => b.offers.length - a.offers.length);
  }, [allOffers]);

  const selected = countries.find((c) => c.name === country);

  if (selected) {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => setCountry(null)} style={styles.back} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
          <Text style={styles.backText}>{t("countries.back")}</Text>
        </Pressable>
        <Text style={styles.title}>
          {selected.flag} {tc(selected.name)}
        </Text>
        <Text style={styles.meta}>
          {t("countries.summary", { offers: selected.offers.length, leagues: selected.leagues })}
        </Text>
        {selected.offers.map((offer) => (
          <Pressable
            key={offer.id}
            onPress={() => onOpenOffer(offer)}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: COLORS.surface }]}
          >
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {offer.title}
              </Text>
              <Text style={styles.meta}>
                {offer.club} · {offer.league} · {offer.salary}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
          </Pressable>
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.intro}>{t("countries.intro")}</Text>
      {countries.map((c) => (
        <Pressable
          key={c.name}
          onPress={() => setCountry(c.name)}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: COLORS.surface }]}
        >
          <Text style={styles.flag}>{c.flag}</Text>
          <View style={styles.rowBody}>
            <Text style={styles.rowTitle}>{tc(c.name)}</Text>
            <Text style={styles.meta}>
              {t("countries.summary", { offers: c.offers.length, leagues: c.leagues })}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  intro: { fontSize: 13, color: COLORS.muted, marginBottom: 8, lineHeight: 18 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  flag: { fontSize: 26 },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 16, color: COLORS.ink },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  back: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, color: COLORS.ink },
  title: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
});
