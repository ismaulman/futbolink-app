import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  Candidate,
  candidateStatus,
  MOCK_PLAYERS,
  MyOffer,
  Offer,
  Player,
} from "../data";
import { tc } from "../i18n";
import { timeAgo } from "../i18n/format";
import { offerMatch } from "../match";
import { COLORS, FONT, RADIUS } from "../theme";

type Props = {
  offer: MyOffer;
  // Detalle de la oferta (para calcular la compatibilidad y abrirla).
  offerDetail: Offer | null;
  canRequestRepresentation: boolean;
  onOpenPlayer: (player: Player) => void;
  onToggle: (playerId: string, field: "interested" | "shortlisted") => void;
  onRequestRepresentation: (playerId: string) => void;
  onOpenOffer: (offer: Offer) => void;
  onBack: () => void;
};

type Filter = "ALL" | ApplicationStatus;
type Row = { candidate: Candidate; player: Player; status: ApplicationStatus; score: number | null };

const FACTORS = ["Position", "Experience", "Secondary", "Age", "Passport"] as const;
const WEEK_HOURS = 7 * 24;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Tile({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <View style={styles.tile}>
      <Text style={[styles.tileValue, accent && styles.tileAccent]}>{value}</Text>
      <Text style={styles.tileLabel} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const STATUS_FILTER_KEY: Record<ApplicationStatus, string> = {
  PENDING: "apps.filterPending",
  IN_REVIEW: "apps.filterInReview",
  PROFILE_VIEWED: "apps.filterProfileViewed",
  INTERESTED: "apps.filterInterested",
};

// Postulantes de una oferta: métricas, filtros por estado, compatibilidad y embudo,
// como la pantalla de postulantes de la web.
export default function CandidatesScreen({
  offer,
  offerDetail,
  canRequestRepresentation,
  onOpenPlayer,
  onToggle,
  onRequestRepresentation,
  onOpenOffer,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Filter>("ALL");
  const [showMatchInfo, setShowMatchInfo] = useState(false);
  const [repFor, setRepFor] = useState<string | null>(null);
  const [repMessage, setRepMessage] = useState("");
  const [repSent, setRepSent] = useState<string[]>([]);

  // Ordenados por compatibilidad con la oferta (los que no se pueden evaluar, al final).
  const rows = useMemo<Row[]>(
    () =>
      offer.candidates
        .map((candidate) => {
          const player = MOCK_PLAYERS.find((p) => p.id === candidate.playerId);
          return player
            ? { candidate, player, status: candidateStatus(candidate), score: offerMatch(player, offerDetail) }
            : null;
        })
        .filter((r): r is Row => r !== null)
        .sort((a, b) => (b.score ?? -1) - (a.score ?? -1)),
    [offer.candidates, offerDetail],
  );

  const count = (status: ApplicationStatus) => rows.filter((r) => r.status === status).length;
  const total = rows.length;
  const fresh = rows.filter((r) => r.candidate.hoursAgo <= WEEK_HOURS).length;
  const visible = filter === "ALL" ? rows : rows.filter((r) => r.status === filter);

  const sendRepresentation = (playerId: string) => {
    onRequestRepresentation(playerId);
    setRepSent((c) => [...c, playerId]);
    setRepFor(null);
    setRepMessage("");
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("apps.applicantsKicker")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.offerTitle}>{offer.title}</Text>
        {offerDetail && (
          <Pressable onPress={() => onOpenOffer(offerDetail)} hitSlop={8}>
            <Text style={styles.link}>{t("apps.viewOffer")}</Text>
          </Pressable>
        )}

        <View style={styles.tiles}>
          <Tile label={t("apps.applicantsKicker")} value={total} accent />
          <Tile label={t("apps.statNewWeek")} value={fresh} accent={fresh > 0} />
          <Tile label={t("apps.statToReview")} value={count("PENDING")} />
          <Tile label={t("apps.statInterested")} value={count("INTERESTED")} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {(["ALL", ...APPLICATION_STATUSES] as Filter[]).map((key) => {
            const active = filter === key;
            const label = key === "ALL" ? t("apps.filterAll") : t(STATUS_FILTER_KEY[key]);
            const n = key === "ALL" ? total : count(key);
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

        {visible.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              {total === 0 ? t("apps.applicantsEmptyTitle") : t("apps.noCandidatesFilter")}
            </Text>
            {total === 0 && <Text style={styles.emptyText}>{t("apps.applicantsEmptyText")}</Text>}
          </View>
        ) : (
          <>
            <Text style={styles.sorted}>{t("apps.sortedByMatch")}</Text>
            {visible.map(({ candidate, player, status, score }) => (
              <View key={player.id} style={styles.card}>
                <Pressable onPress={() => onOpenPlayer(player)} style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials(player.name)}</Text>
                  </View>
                  <View style={styles.body}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>
                        {player.name}
                      </Text>
                      {player.verified && <Ionicons name="checkmark-circle" size={15} color={COLORS.primaryDark} />}
                    </View>
                    <Text style={styles.meta}>
                      {tc(player.position)} · {t("player.age", { count: player.age })}
                    </Text>
                    <Text style={styles.meta}>
                      {player.flag} {tc(player.country)} · {timeAgo(t, candidate.hoursAgo)}
                    </Text>
                  </View>
                  <View style={styles.scoreBox}>
                    <Text style={[styles.score, (score ?? 0) < 50 && styles.scoreLow]}>
                      {score === null ? "—" : `${score}%`}
                    </Text>
                    <Text style={styles.scoreLabel}>{t("apps.colMatch")}</Text>
                  </View>
                </Pressable>

                <View style={styles.cardBottom}>
                  <Text style={[styles.pill, status === "INTERESTED" && styles.pillInterested, status === "IN_REVIEW" && styles.pillReview]}>
                    {t(STATUS_FILTER_KEY[status])}
                  </Text>
                  <View style={styles.actions}>
                    {canRequestRepresentation && (
                      <Pressable
                        onPress={() => setRepFor(repFor === player.id ? null : player.id)}
                        hitSlop={8}
                        accessibilityLabel={t("apps.requestRepresentation")}
                      >
                        <Ionicons
                          name={repSent.includes(player.id) ? "briefcase" : "briefcase-outline"}
                          size={22}
                          color={repSent.includes(player.id) ? COLORS.primary : COLORS.muted}
                        />
                      </Pressable>
                    )}
                    <Pressable onPress={() => onToggle(player.id, "interested")} hitSlop={8} accessibilityLabel={t("apps.interested")}>
                      <Ionicons
                        name={candidate.interested ? "thumbs-up" : "thumbs-up-outline"}
                        size={22}
                        color={candidate.interested ? COLORS.primary : COLORS.muted}
                      />
                    </Pressable>
                    <Pressable onPress={() => onToggle(player.id, "shortlisted")} hitSlop={8} accessibilityLabel={t("candidates.shortlist")}>
                      <Ionicons
                        name={candidate.shortlisted ? "star" : "star-outline"}
                        size={22}
                        color={candidate.shortlisted ? COLORS.warning : COLORS.muted}
                      />
                    </Pressable>
                  </View>
                </View>

                {repFor === player.id && (
                  <View style={styles.repBox}>
                    <Text style={styles.repTitle}>
                      {t("apps.requestRepresentationToPerson", { name: player.name })}
                    </Text>
                    <TextInput
                      value={repMessage}
                      onChangeText={setRepMessage}
                      placeholder={t("apps.requestMessagePlaceholderPlayer")}
                      placeholderTextColor={COLORS.subtle}
                      multiline
                      maxLength={500}
                      style={styles.repInput}
                    />
                    <View style={styles.repActions}>
                      <Pressable onPress={() => setRepFor(null)} style={styles.repCancel}>
                        <Text style={styles.repCancelText}>{t("apps.cancel")}</Text>
                      </Pressable>
                      <Pressable onPress={() => sendRepresentation(player.id)} style={styles.repSend}>
                        <Text style={styles.repSendText}>{t("apps.requestRepresentation")}</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
                {repSent.includes(player.id) && repFor !== player.id && (
                  <Text style={styles.repSent}>{t("apps.repRequestSent")}</Text>
                )}
              </View>
            ))}
          </>
        )}

        <Text style={styles.section}>{t("apps.funnelTitle")}</Text>
        {APPLICATION_STATUSES.map((status) => (
          <View key={status} style={styles.funnelRow}>
            <View style={styles.funnelTop}>
              <Text style={styles.funnelLabel}>{t(STATUS_FILTER_KEY[status])}</Text>
              <Text style={styles.funnelCount}>{count(status)}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${total ? (count(status) / total) * 100 : 0}%` }]} />
            </View>
          </View>
        ))}

        <Pressable onPress={() => setShowMatchInfo((v) => !v)} style={styles.infoRow}>
          <Ionicons name="sparkles-outline" size={20} color={COLORS.primaryDark} />
          <View style={styles.body}>
            <Text style={styles.name}>{t("apps.howMatchWorksShort")}</Text>
            <Text style={styles.meta}>{t("apps.howMatchWorksHint")}</Text>
          </View>
          <Ionicons name={showMatchInfo ? "chevron-up" : "chevron-down"} size={18} color={COLORS.subtle} />
        </Pressable>
        {showMatchInfo &&
          FACTORS.map((f) => (
            <View key={f} style={styles.factor}>
              <Text style={styles.factorTitle}>{t(`apps.factor${f}Title`)}</Text>
              <Text style={styles.meta}>{t(`apps.factor${f}Desc`)}</Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 40 },
  offerTitle: { fontSize: 20, fontWeight: "500", color: COLORS.ink, lineHeight: 26 },
  link: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark, marginTop: 6 },
  tiles: { flexDirection: "row", gap: 8, marginTop: 16 },
  tile: { flex: 1, padding: 10, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  tileValue: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  tileAccent: { color: COLORS.primaryDark },
  tileLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  filters: { gap: 18, marginTop: 18, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  filter: { paddingTop: 8 },
  filterText: { fontSize: 14, color: COLORS.muted, paddingBottom: 8 },
  filterTextActive: { color: COLORS.ink, fontWeight: "500" },
  filterCount: { fontSize: 12, color: COLORS.subtle },
  underline: { height: 2, backgroundColor: "transparent" },
  underlineActive: { backgroundColor: COLORS.primary },
  sorted: { fontSize: 12, color: COLORS.muted, marginTop: 14, marginBottom: 4 },
  empty: { alignItems: "center", paddingVertical: 36, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  emptyText: { fontSize: 13, color: COLORS.muted, textAlign: "center", lineHeight: 18 },
  card: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
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
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2, lineHeight: 18 },
  scoreBox: { alignItems: "center" },
  score: { fontSize: 18, fontWeight: "500", color: COLORS.primaryDark },
  scoreLow: { color: COLORS.muted },
  scoreLabel: { fontSize: 10, color: COLORS.subtle },
  cardBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 },
  pill: {
    fontSize: 12,
    color: COLORS.muted,
    backgroundColor: COLORS.divider,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    overflow: "hidden",
  },
  pillInterested: { color: COLORS.primaryDark, backgroundColor: COLORS.primarySoft },
  pillReview: { color: COLORS.ink, backgroundColor: COLORS.surface },
  actions: { flexDirection: "row", gap: 16 },
  repBox: { marginTop: 10, padding: 12, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, gap: 8 },
  repTitle: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  repInput: {
    fontFamily: FONT.regular,
    minHeight: 64,
    padding: 10,
    fontSize: 14,
    color: COLORS.ink,
    textAlignVertical: "top",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  repActions: { flexDirection: "row", gap: 8 },
  repCancel: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  repCancelText: { fontSize: 14, color: COLORS.ink },
  repSend: { flex: 1, height: 38, borderRadius: RADIUS.sm, backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  repSendText: { fontSize: 14, fontWeight: "500", color: COLORS.white },
  repSent: { fontSize: 12, color: COLORS.primaryDark, marginTop: 8 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 26, marginBottom: 8 },
  funnelRow: { marginBottom: 12 },
  funnelTop: { flexDirection: "row", justifyContent: "space-between" },
  funnelLabel: { fontSize: 13, color: COLORS.ink },
  funnelCount: { fontSize: 13, fontWeight: "500", color: COLORS.ink },
  track: { height: 6, borderRadius: 3, backgroundColor: COLORS.divider, marginTop: 4, overflow: "hidden" },
  fill: { height: 6, borderRadius: 3, backgroundColor: COLORS.primaryBorder },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  factor: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  factorTitle: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
});
