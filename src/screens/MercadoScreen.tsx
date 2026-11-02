import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ChipGroup from "../components/ChipGroup";
import OfferCard from "../components/OfferCard";
import { Offer } from "../data";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Filter = "all" | "player" | "staff";
type View_ = "offers" | "saved" | "applied";

const TYPE_FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "common.all" },
  { key: "player", label: "market.filterPlayers" },
  { key: "staff", label: "market.filterStaff" },
];

const VIEWS: { key: View_; label: string }[] = [
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
};

export default function MercadoScreen({
  offers: allOffers,
  appliedIds,
  savedIds,
  onOpenOffer,
  onApply,
  onToggleSave,
}: Props) {
  const { t } = useTranslation();
  const [view, setView] = useState<View_>("offers");
  const [type, setType] = useState<Filter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [country, setCountry] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [position, setPosition] = useState(ALL);

  const countries = useMemo(() => unique(allOffers.map((o) => o.country)), [allOffers]);
  const categories = useMemo(() => unique(allOffers.map((o) => o.category)), [allOffers]);
  const positions = useMemo(() => unique(allOffers.flatMap((o) => o.positions)), [allOffers]);

  const activeFilters = [country, category, position].filter((v) => v !== ALL).length;

  const offers = allOffers.filter((offer) => {
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
    view === "saved"
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

        <View style={styles.filtersRow}>
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
        </View>

        {showFilters && (
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
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{emptyText}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
