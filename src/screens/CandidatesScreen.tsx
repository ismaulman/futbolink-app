import { Ionicons } from "@expo/vector-icons";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { MOCK_PLAYERS, MyOffer, Player } from "../data";
import { tc } from "../i18n";
import { timeAgo } from "../i18n/format";
import { COLORS, RADIUS } from "../theme";

type Props = {
  offer: MyOffer;
  onOpenPlayer: (player: Player) => void;
  onToggle: (playerId: string, field: "interested" | "shortlisted") => void;
  onBack: () => void;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function CandidatesScreen({ offer, onOpenPlayer, onToggle, onBack }: Props) {
  const { t } = useTranslation();
  const rows = offer.candidates
    .map((c) => ({ candidate: c, player: MOCK_PLAYERS.find((p) => p.id === c.playerId) }))
    .filter((r): r is { candidate: typeof r.candidate; player: Player } => r.player !== undefined);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("candidates.title")} onBack={onBack} />
      <Text style={styles.offerTitle}>{offer.title}</Text>

      <FlatList
        data={rows}
        keyExtractor={(r) => r.player.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>{t("candidates.empty")}</Text>}
        renderItem={({ item: { candidate, player } }) => (
          <Pressable
            onPress={() => onOpenPlayer(player)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials(player.name)}</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.nameRow}>
                <Text style={styles.name} numberOfLines={1}>
                  {player.name}
                </Text>
                {player.verified && (
                  <Ionicons name="checkmark-circle" size={15} color={COLORS.primaryDark} />
                )}
                {!candidate.viewed && <Text style={styles.new}>{t("candidates.new")}</Text>}
              </View>
              <Text style={styles.meta}>
                {tc(player.position)} · {t("player.age", { count: player.age })}
              </Text>
              <Text style={styles.meta}>
                {player.flag} {tc(player.country)} · {timeAgo(t, candidate.hoursAgo)}
              </Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() => onToggle(player.id, "interested")}
                hitSlop={8}
                accessibilityLabel={t("candidates.interested")}
              >
                <Ionicons
                  name={candidate.interested ? "thumbs-up" : "thumbs-up-outline"}
                  size={22}
                  color={candidate.interested ? COLORS.primary : COLORS.muted}
                />
              </Pressable>
              <Pressable
                onPress={() => onToggle(player.id, "shortlisted")}
                hitSlop={8}
                accessibilityLabel={t("candidates.shortlist")}
              >
                <Ionicons
                  name={candidate.shortlisted ? "star" : "star-outline"}
                  size={22}
                  color={candidate.shortlisted ? COLORS.warning : COLORS.muted}
                />
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  offerTitle: {
    fontSize: 14,
    color: COLORS.muted,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  rowPressed: { backgroundColor: COLORS.surface },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, color: COLORS.primaryDark, fontWeight: "500" },
  body: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 15, color: COLORS.ink, fontWeight: "500", flexShrink: 1 },
  new: {
    fontSize: 11,
    color: COLORS.primaryDark,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  actions: { flexDirection: "row", gap: 14 },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
});
