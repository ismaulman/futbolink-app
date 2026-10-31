import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ChipGroup from "../components/ChipGroup";
import { MOCK_PLAYERS, POSITIONS, Player } from "../data";
import { tc } from "../i18n";
import { COLORS, FONT, RADIUS } from "../theme";

const ALL = "";
const FEET = ["Derecho", "Izquierdo", "Ambos"];
const unique = (values: string[]) => Array.from(new Set(values));

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type CardProps = {
  player: Player;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
};

function PlayerCard({ player, saved, onOpen, onToggleSave }: CardProps) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(player.name)}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {player.name}
          </Text>
          {player.verified && (
            <Ionicons name="checkmark-circle" size={16} color={COLORS.primaryDark} />
          )}
        </View>
        <Text style={styles.position}>{tc(player.position)}</Text>
        <Text style={styles.meta}>
          {t("player.age", { count: player.age })} · {player.height} · {tc(player.category)}
        </Text>
        <Text style={styles.meta}>
          {player.flag} {tc(player.country)} · {player.club}
        </Text>
      </View>
      <Pressable
        onPress={onToggleSave}
        hitSlop={10}
        accessibilityLabel={saved ? t("player.unsave") : t("player.save")}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={20}
          color={saved ? COLORS.primary : COLORS.muted}
        />
      </Pressable>
    </Pressable>
  );
}

type Props = {
  savedIds: string[];
  onOpenPlayer: (player: Player) => void;
  onToggleSave: (playerId: string) => void;
};

export default function BuscarScreen({ savedIds, onOpenPlayer, onToggleSave }: Props) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [onlySaved, setOnlySaved] = useState(false);
  const [position, setPosition] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);
  const [country, setCountry] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [foot, setFoot] = useState(ALL);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const countries = useMemo(() => unique(MOCK_PLAYERS.map((p) => p.country)), []);
  const categories = useMemo(() => unique(MOCK_PLAYERS.map((p) => p.category)), []);

  const activeFilters =
    [country, category, foot].filter((v) => v !== ALL).length + (verifiedOnly ? 1 : 0);

  const text = query.trim().toLowerCase();
  const players = MOCK_PLAYERS.filter((player) => {
    if (onlySaved && !savedIds.includes(player.id)) return false;
    if (position !== "Todas" && player.position !== position) return false;
    if (country !== ALL && player.country !== country) return false;
    if (category !== ALL && player.category !== category) return false;
    if (foot !== ALL && player.foot !== foot) return false;
    if (verifiedOnly && !player.verified) return false;
    return (
      text === "" ||
      player.name.toLowerCase().includes(text) ||
      player.club.toLowerCase().includes(text) ||
      player.country.toLowerCase().includes(text)
    );
  });

  const withAll = (values: string[]) => [
    { value: ALL, label: t("common.all") },
    ...values.map((v) => ({ value: v, label: tc(v) })),
  ];

  const clearFilters = () => {
    setCountry(ALL);
    setCategory(ALL);
    setFoot(ALL);
    setVerifiedOnly(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>{t("search.title")}</Text>

        <View style={styles.views}>
          {[
            { saved: false, label: t("search.tabAll") },
            { saved: true, label: t("search.tabSaved") },
          ].map((item) => {
            const active = onlySaved === item.saved;
            return (
              <Pressable
                key={item.label}
                onPress={() => setOnlySaved(item.saved)}
                style={[styles.viewTab, active && styles.viewTabActive]}
              >
                <Text style={[styles.viewText, active && styles.viewTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color={COLORS.muted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t("search.placeholder")}
              placeholderTextColor={COLORS.subtle}
              style={styles.input}
            />
          </View>
          <Pressable
            onPress={() => setShowFilters((v) => !v)}
            style={[styles.filterButton, activeFilters > 0 && styles.chipActive]}
            accessibilityLabel={t("search.filters")}
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFilters > 0 ? COLORS.primaryDark : COLORS.ink}
            />
            {activeFilters > 0 && <Text style={styles.badge}>{activeFilters}</Text>}
          </Pressable>
        </View>

        {showFilters && (
          <View style={styles.panel}>
            <ChipGroup
              label={t("search.country")}
              options={withAll(countries)}
              value={country}
              onChange={setCountry}
            />
            <ChipGroup
              label={t("search.category")}
              options={withAll(categories)}
              value={category}
              onChange={setCategory}
            />
            <ChipGroup
              label={t("search.foot")}
              options={withAll(FEET)}
              value={foot}
              onChange={setFoot}
            />
            <Pressable
              onPress={() => setVerifiedOnly((v) => !v)}
              style={[styles.chip, styles.verifiedChip, verifiedOnly && styles.chipActive]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color={verifiedOnly ? COLORS.primaryDark : COLORS.muted}
              />
              <Text style={[styles.chipText, verifiedOnly && styles.chipTextActive]}>
                {t("search.verifiedOnly")}
              </Text>
            </Pressable>
            {activeFilters > 0 && (
              <Pressable onPress={clearFilters}>
                <Text style={styles.clear}>{t("search.clear")}</Text>
              </Pressable>
            )}
          </View>
        )}

        <FlatList
          horizontal
          data={POSITIONS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => {
            const active = item === position;
            return (
              <Pressable
                onPress={() => setPosition(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item === "Todas" ? t("common.all") : tc(item)}
                </Text>
              </Pressable>
            );
          }}
        />

        <Text style={styles.subheading}>{t("search.count", { count: players.length })}</Text>
      </View>

      <FlatList
        data={players}
        keyExtractor={(player) => player.id}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            saved={savedIds.includes(item.id)}
            onOpen={() => onOpenPlayer(item)}
            onToggleSave={() => onToggleSave(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {onlySaved ? t("search.emptySaved") : t("search.empty")}
          </Text>
        }
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
  searchRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.ink,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    overflow: "hidden",
    textAlign: "center",
    lineHeight: 18,
    fontSize: 11,
    color: COLORS.white,
    backgroundColor: COLORS.primary,
  },
  panel: {
    marginTop: 12,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  verifiedChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  clear: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark },
  chipsRow: { gap: 8, paddingTop: 12 },
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
  subheading: { fontSize: 13, color: COLORS.muted, marginTop: 12 },
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  cardPressed: { backgroundColor: COLORS.surface },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "500", color: COLORS.primaryDark },
  cardBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 15, fontWeight: "500", color: COLORS.ink, flexShrink: 1 },
  position: { fontSize: 14, color: COLORS.ink, marginTop: 2 },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 32,
    paddingHorizontal: 24,
    lineHeight: 20,
  },
});
