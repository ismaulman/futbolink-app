import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { AgencyApplication, MONTHLY_CREDITS, MOCK_OFFERS, MOCK_PLAYERS, Player, PortfolioEntry } from "../data";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Props = {
  portfolio: PortfolioEntry[];
  applications: AgencyApplication[];
  onRequest: (playerId: string) => void;
  onRemove: (playerId: string) => void;
  onApply: (playerId: string, offerId: string) => void;
  onOpenPlayer: (player: Player) => void;
  onBack: () => void;
};

// Portafolio de la agencia: jugadores representados, solicitudes de representación
// y postulaciones en nombre de un jugador (cada una gasta 1 crédito del mes).
export default function PortfolioScreen({
  portfolio,
  applications,
  onRequest,
  onRemove,
  onApply,
  onOpenPlayer,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [applyFor, setApplyFor] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const credits = MONTHLY_CREDITS - applications.length;
  const playerOf = (id: string) => MOCK_PLAYERS.find((p) => p.id === id);
  const active = portfolio.filter((e) => e.status === "active");
  const pending = portfolio.filter((e) => e.status === "pending");
  const candidates = MOCK_PLAYERS.filter((p) => !portfolio.some((e) => e.playerId === p.id));
  const target = applyFor ? playerOf(applyFor) : undefined;

  // Elegir la oferta a la que postula la agencia en nombre del jugador.
  if (target) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t("portfolio.applyFor", { name: target.name })} onBack={() => setApplyFor(null)} />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.credits}>{t("portfolio.creditsLeft", { left: credits, total: MONTHLY_CREDITS })}</Text>
          {credits <= 0 && <Text style={styles.warning}>{t("portfolio.noCredits")}</Text>}
          {MOCK_OFFERS.filter((o) => o.type === "player").map((offer) => {
            const done = applications.some((a) => a.playerId === target.id && a.offerId === offer.id);
            const disabled = done || credits <= 0;
            return (
              <View key={offer.id} style={styles.row}>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {offer.title}
                  </Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>
                    {offer.club} · {offer.flag} {tc(offer.country)}
                  </Text>
                </View>
                <Pressable
                  disabled={disabled}
                  onPress={() => onApply(target.id, offer.id)}
                  style={[styles.outlineBtn, disabled && styles.btnDisabled]}
                >
                  <Text style={styles.outlineText}>{done ? t("portfolio.applied") : t("portfolio.apply")}</Text>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("portfolio.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.creditBox}>
          <Text style={styles.creditValue}>
            {credits}
            <Text style={styles.creditTotal}> / {MONTHLY_CREDITS}</Text>
          </Text>
          <Text style={styles.rowMeta}>{t("portfolio.creditsHint")}</Text>
        </View>

        <Text style={styles.section}>{t("portfolio.represented")}</Text>
        {active.length === 0 && <Text style={styles.empty}>{t("portfolio.emptyRepresented")}</Text>}
        {active.map((entry) => {
          const player = playerOf(entry.playerId);
          if (!player) return null;
          const count = applications.filter((a) => a.playerId === player.id).length;
          return (
            <View key={player.id} style={styles.row}>
              <Pressable style={styles.rowBody} onPress={() => onOpenPlayer(player)}>
                <Text style={styles.rowTitle}>{player.name}</Text>
                <Text style={styles.rowMeta}>
                  {tc(player.position)} · {t("player.age", { count: player.age })}
                  {count > 0 ? ` · ${t("portfolio.applicationsCount", { count })}` : ""}
                </Text>
              </Pressable>
              <Pressable onPress={() => setApplyFor(player.id)} style={styles.outlineBtn}>
                <Text style={styles.outlineText}>{t("portfolio.applyAction")}</Text>
              </Pressable>
              <Pressable onPress={() => onRemove(player.id)} hitSlop={8} accessibilityLabel={t("portfolio.release")}>
                <Ionicons name="close-circle-outline" size={22} color={COLORS.muted} />
              </Pressable>
            </View>
          );
        })}

        {pending.length > 0 && (
          <>
            <Text style={styles.section}>{t("portfolio.pending")}</Text>
            {pending.map((entry) => {
              const player = playerOf(entry.playerId);
              if (!player) return null;
              return (
                <View key={player.id} style={styles.row}>
                  <View style={styles.rowBody}>
                    <Text style={styles.rowTitle}>{player.name}</Text>
                    <Text style={styles.rowMeta}>{t("portfolio.waiting")}</Text>
                  </View>
                  <Pressable onPress={() => onRemove(player.id)} hitSlop={8} accessibilityLabel={t("portfolio.cancel")}>
                    <Ionicons name="close-circle-outline" size={22} color={COLORS.muted} />
                  </Pressable>
                </View>
              );
            })}
          </>
        )}

        <Pressable onPress={() => setAdding((v) => !v)} style={styles.addBtn}>
          <Ionicons name={adding ? "remove" : "add"} size={20} color={COLORS.white} />
          <Text style={styles.addText}>{t("portfolio.add")}</Text>
        </Pressable>
        {adding && (
          <View style={styles.addList}>
            {candidates.length === 0 && <Text style={styles.empty}>{t("portfolio.noMore")}</Text>}
            {candidates.map((player) => (
              <View key={player.id} style={styles.row}>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{player.name}</Text>
                  <Text style={styles.rowMeta}>
                    {tc(player.position)} · {t("player.age", { count: player.age })}
                  </Text>
                </View>
                <Pressable onPress={() => onRequest(player.id)} style={styles.outlineBtn}>
                  <Text style={styles.outlineText}>{t("portfolio.request")}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  creditBox: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
    alignItems: "center",
  },
  creditValue: { fontSize: 28, fontWeight: "500", color: COLORS.ink },
  creditTotal: { fontSize: 16, color: COLORS.muted },
  credits: { fontSize: 13, color: COLORS.muted, marginBottom: 8 },
  warning: { fontSize: 13, color: COLORS.danger, marginBottom: 8 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 22, marginBottom: 4 },
  empty: { fontSize: 14, color: COLORS.muted, marginTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, color: COLORS.ink },
  rowMeta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  outlineBtn: {
    paddingHorizontal: 12,
    height: 32,
    justifyContent: "center",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  outlineText: { fontSize: 13, fontWeight: "500", color: COLORS.ink },
  btnDisabled: { opacity: 0.45 },
  addBtn: {
    marginTop: 22,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  addList: { marginTop: 6 },
});
