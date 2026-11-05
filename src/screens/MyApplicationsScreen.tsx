import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { APPLICATION_STATUSES, ApplicationStatus, Offer } from "../data";
import { COLORS, RADIUS } from "../theme";

export const STATUS_LABEL_KEY: Record<ApplicationStatus, string> = {
  PENDING: "apps.filterPending",
  IN_REVIEW: "apps.filterInReview",
  PROFILE_VIEWED: "apps.filterProfileViewed",
  INTERESTED: "apps.filterInterested",
};

// Colores de la pastilla de estado (misma lógica que la web).
export const STATUS_COLOR: Record<ApplicationStatus, { bg: string; fg: string }> = {
  PENDING: { bg: COLORS.divider, fg: COLORS.muted },
  IN_REVIEW: { bg: "#fef3c7", fg: "#92400e" },
  PROFILE_VIEWED: { bg: "#dbeafe", fg: "#1e40af" },
  INTERESTED: { bg: COLORS.primarySoft, fg: COLORS.primaryDark },
};

export function StatusPill({ status }: { status: ApplicationStatus }) {
  const { t } = useTranslation();
  const c = STATUS_COLOR[status];
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.pillText, { color: c.fg }]}>{t(STATUS_LABEL_KEY[status])}</Text>
    </View>
  );
}

type Filter = "ALL" | ApplicationStatus;

type Props = {
  offers: Offer[]; // ofertas a las que se postuló
  statuses: Record<string, ApplicationStatus>;
  onOpenOffer: (offer: Offer) => void;
  onSearchOffers: () => void;
  onBack: () => void;
};

// Mis postulaciones: todas las ofertas a las que se postuló, con su estado.
export default function MyApplicationsScreen({ offers, statuses, onOpenOffer, onSearchOffers, onBack }: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("ALL");
  const statusOf = (o: Offer): ApplicationStatus => statuses[o.id] ?? "PENDING";
  const count = (s: ApplicationStatus) => offers.filter((o) => statusOf(o) === s).length;
  const visible = offers.filter((o) => filter === "ALL" || statusOf(o) === filter);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("myApps.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(["ALL", ...APPLICATION_STATUSES] as Filter[]).map((key) => {
            const active = filter === key;
            const label = key === "ALL" ? t("apps.filterAll") : t(STATUS_LABEL_KEY[key]);
            const n = key === "ALL" ? offers.length : count(key);
            return (
              <Pressable key={key} onPress={() => setFilter(key)} style={styles.filter}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                  {label} <Text style={styles.filterCount}>{n}</Text>
                </Text>
                <View style={[styles.underline, active && styles.underlineActive]} />
              </Pressable>
            );
          })}
        </ScrollView>

        {offers.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>{t("myApps.emptyTitle")}</Text>
            <Text style={styles.emptyText}>{t("myApps.emptyText")}</Text>
            <Pressable onPress={onSearchOffers} style={styles.cta}>
              <Text style={styles.ctaText}>{t("home.searchOffers")}</Text>
            </Pressable>
          </View>
        ) : visible.length === 0 ? (
          <Text style={styles.emptyText}>{t("myApps.noneInFilter")}</Text>
        ) : (
          visible.map((offer) => (
            <Pressable key={offer.id} onPress={() => onOpenOffer(offer)} style={styles.row}>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {offer.title}
                </Text>
                <Text style={styles.rowMeta} numberOfLines={1}>
                  {offer.club} · {offer.flag} {offer.region}
                </Text>
              </View>
              <StatusPill status={statusOf(offer)} />
              <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { paddingBottom: 32 },
  filters: { paddingHorizontal: 16, gap: 20, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filter: { paddingTop: 12 },
  filterText: { fontSize: 14, color: COLORS.muted, paddingBottom: 8 },
  filterTextActive: { color: COLORS.ink, fontWeight: "500" },
  filterCount: { fontSize: 12, color: COLORS.subtle },
  underline: { height: 2, backgroundColor: "transparent" },
  underlineActive: { backgroundColor: COLORS.primary },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  rowMeta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  pillText: { fontSize: 11, fontWeight: "500" },
  empty: { alignItems: "center", padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  emptyText: { fontSize: 13, color: COLORS.muted, textAlign: "center", marginTop: 6, padding: 16 },
  cta: { marginTop: 16, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingHorizontal: 20, paddingVertical: 12 },
  ctaText: { color: "#fff", fontWeight: "500", fontSize: 14 },
});
