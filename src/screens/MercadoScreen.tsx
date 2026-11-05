import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ChipGroup from "../components/ChipGroup";
import OfferCard from "../components/OfferCard";
import AlertsCard from "../components/AlertsCard";
import { Offer, POSITIONS, Profile, STAFF_ROLES, User } from "../data";
import { forYou, JobAlert, PUESTO_TO_ROLE, Reason, residenceCountry } from "../forYou";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Filter = "all" | "player" | "staff";
type View_ = "forYou" | "offers" | "saved" | "applied";

const TYPE_FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "common.all" },
  { key: "player", label: "market.filterPlayers" },
  { key: "staff", label: "market.filterStaff" },
];

const VIEWS: { key: View_; label: string }[] = [
  { key: "forYou", label: "forYou.tabForYou" },
  { key: "offers", label: "market.tabOffers" },
  { key: "saved", label: "market.tabSaved" },
  { key: "applied", label: "market.tabApplied" },
];

const ALL = "";
const unique = (values: string[]) => Array.from(new Set(values));

type Props = {
  offers: Offer[];
  appliedIds: string[];
  savedIds: string[];
  onOpenOffer: (offer: Offer) => void;
  onApply: (offerId: string) => void;
  onToggleSave: (offerId: string) => void;
  user: User;
  profile: Profile;
  customAlerts: JobAlert[];
  onAlertsChange: (alerts: JobAlert[]) => void;
  onEditProfile: () => void;
};

export default function MercadoScreen({
  offers: allOffers,
  appliedIds,
  savedIds,
  onOpenOffer,
  onApply,
  onToggleSave,
  user,
  profile,
  customAlerts,
  onAlertsChange,
  onEditProfile,
}: Props) {
  const { t } = useTranslation();
  const isSeeker = user.role !== "agency";
  const [view, setView] = useState<View_>(isSeeker ? "forYou" : "offers");
  const [type, setType] = useState<Filter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [country, setCountry] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [position, setPosition] = useState(ALL);

  const countries = useMemo(() => unique(allOffers.map((o) => o.country)), [allOffers]);
  const categories = useMemo(() => unique(allOffers.map((o) => o.category)), [allOffers]);
  const positions = useMemo(() => unique(allOffers.flatMap((o) => o.positions)), [allOffers]);

  // "Para vos": afinidad con el perfil (jugador: posición; staff: su puesto).
  const isStaff = user.role === "staff";
  const ownPosition = isStaff ? (user.puesto ? (PUESTO_TO_ROLE[user.puesto] ?? "") : "") : profile.position;
  const secondary = isStaff ? "" : profile.secondaryPosition;
  const residence = residenceCountry(profile);
  const feed = useMemo(
    () => forYou(allOffers, ownPosition, secondary, residence),
    [allOffers, ownPosition, secondary, residence],
  );
  const alerts: JobAlert[] = [
    ...(ownPosition ? [{ id: "auto", kind: "AUTO" as const, position: ownPosition, country: residence || null }] : []),
    ...customAlerts,
  ];
  const reasonText = (reasons: Reason[]) =>
    reasons
      .filter((r) => r !== "recent")
      .map((r) => t(`forYou.reason${r === "position" ? "Position" : r === "secondaryPosition" ? "SecondaryPosition" : "Country"}`).toLowerCase())
      .join(t("forYou.and"));

  const activeFilters = [country, category, position].filter((v) => v !== ALL).length;

  const offers = view === "forYou" ? feed.items.map((i) => i.offer) : allOffers.filter((offer) => {
    if (view === "saved" && !savedIds.includes(offer.id)) return false;
    if (view === "applied" && !appliedIds.includes(offer.id)) return false;
    if (type !== "all" && offer.type !== type) return false;
    if (country !== ALL && offer.country !== country) return false;
    if (category !== ALL && offer.category !== category) return false;
    if (position !== ALL && !offer.positions.includes(position)) return false;
    return true;
  });

  const clearFilters = () => {
    setCountry(ALL);
    setCategory(ALL);
    setPosition(ALL);
  };

  const withAll = (values: string[]) => [
    { value: ALL, label: t("common.all") },
    ...values.map((v) => ({ value: v, label: tc(v) })),
  ];

  const emptyText =
    view === "forYou"
      ? t("forYou.emptyTitle")
      : view === "saved"
      ? t("market.emptySaved")
      : view === "applied"
        ? t("market.emptyApplied")
        : t("market.emptyFilters");

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>{t("market.title")}</Text>

        <View style={styles.views}>
          {VIEWS.map((item) => {
            const active = view === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setView(item.key)}
                style={[styles.viewTab, active && styles.viewTabActive]}
              >
                <Text style={[styles.viewText, active && styles.viewTextActive]}>
                  {t(item.label)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {view !== "forYou" && <View style={styles.filtersRow}>
          {TYPE_FILTERS.map((item) => {
            const active = type === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setType(item.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {t(item.label)}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            style={[styles.chip, styles.filterButton, activeFilters > 0 && styles.chipActive]}
          >
            <Ionicons
              name="options-outline"
              size={15}
              color={activeFilters > 0 ? COLORS.primaryDark : COLORS.muted}
            />
            <Text style={[styles.chipText, activeFilters > 0 && styles.chipTextActive]}>
              {t("market.filters")}
              {activeFilters > 0 ? ` (${activeFilters})` : ""}
            </Text>
          </Pressable>
        </View>}

        {view !== "forYou" && showFilters && (
          <View style={styles.panel}>
            <ChipGroup
              label={t("market.country")}
              options={withAll(countries)}
              value={country}
              onChange={setCountry}
            />
            <ChipGroup
              label={t("market.category")}
              options={withAll(categories)}
              value={category}
              onChange={setCategory}
            />
            <ChipGroup
              label={t("market.position")}
              options={withAll(positions)}
              value={position}
              onChange={setPosition}
            />
            {activeFilters > 0 && (
              <Pressable onPress={clearFilters}>
                <Text style={styles.clear}>{t("market.clear")}</Text>
              </Pressable>
            )}
          </View>
        )}

        <Text style={styles.subheading}>
          {t("market.count", { count: offers.length })}
        </Text>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(offer) => offer.id}
        renderItem={({ item }) => (
          <OfferCard
            offer={item}
            applied={appliedIds.includes(item.id)}
            saved={savedIds.includes(item.id)}
            onOpen={() => onOpenOffer(item)}
            onApply={() => onApply(item.id)}
            onToggleSave={() => onToggleSave(item.id)}
            why={
              view === "forYou" && !feed.fallback
                ? `${t("forYou.whyShown")} ${reasonText(feed.items.find((i) => i.offer.id === item.id)?.reasons ?? [])}`
                : undefined
            }
          />
        )}
        ListHeaderComponent={
          view === "forYou" ? (
            <View>
              {!ownPosition && (
                <View style={styles.banner}>
                  <Text style={styles.bannerText}>{t("forYou.completeProfile")}</Text>
                  <Pressable onPress={onEditProfile} hitSlop={8}>
                    <Text style={styles.bannerLink}>{t("forYou.completeProfileCta")}</Text>
                  </Pressable>
                </View>
              )}
              {!!ownPosition && feed.fallback && feed.items.length > 0 && (
                <View style={styles.banner}>
                  <Text style={styles.bannerText}>{t("forYou.fallbackNote")}</Text>
                </View>
              )}
              <AlertsCard
                alerts={alerts}
                offers={allOffers}
                positionOptions={isStaff ? STAFF_ROLES : POSITIONS.filter((p) => p !== "Todas")}
                countryOptions={countries}
                defaultCountry={residence}
                onChange={(next) => onAlertsChange(next.filter((a) => a.kind === "CUSTOM"))}
              />
            </View>
          ) : null
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  banner: { padding: 14, marginBottom: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primarySoft },
  bannerText: { fontSize: 13, color: COLORS.ink, lineHeight: 19 },
  bannerLink: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark, marginTop: 8 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  heading: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  views: {
    flexDirection: "row",
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  viewTab: {
    paddingVertical: 10,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  viewTabActive: { borderBottomColor: COLORS.primary },
  viewText: { fontSize: 14, color: COLORS.muted },
  viewTextActive: { color: COLORS.ink, fontWeight: "500" },
  filtersRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryBorder,
  },
  chipText: { fontSize: 13, fontWeight: "500", color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark },
  filterButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  panel: {
    marginTop: 12,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  clear: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark },
  subheading: { fontSize: 13, color: COLORS.muted, marginTop: 12 },
  list: { padding: 16, gap: 12 },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 32,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
});
