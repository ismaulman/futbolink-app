import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { VisibilityPlan } from "../data";
import { Agent, MOCK_AGENTS, RepRequest, RepStatus, REJECTION_COOLDOWN_DAYS, cooldownLeft, quotaOf } from "../representation";
import { tc } from "../i18n";
import { COLORS, FONT, RADIUS } from "../theme";

type Props = {
  plan: VisibilityPlan;
  requests: RepRequest[];
  agentId: string | null;
  onRequest: (agentId: string, message: string) => void;
  onRespond: (requestId: string, status: "ACCEPTED" | "REJECTED") => void;
  onReleaseAgent: () => void;
  onSeePlans: () => void;
  onBack: () => void;
};

const STATUS_STYLE: Record<RepStatus, { bg: string; fg: string }> = {
  PENDING: { bg: "#fef3c7", fg: "#92400e" },
  ACCEPTED: { bg: COLORS.primarySoft, fg: COLORS.primaryDark },
  REJECTED: { bg: "#fee2e2", fg: "#b91c1c" },
};
const STATUS_KEY: Record<RepStatus, string> = {
  PENDING: "rep.statusPending",
  ACCEPTED: "rep.statusAccepted",
  REJECTED: "rep.statusRejected",
};

const agentOf = (id: string): Agent | undefined => MOCK_AGENTS.find((a) => a.id === id);

// Representación del jugador: pedir representación, invitaciones y agente actual.
export default function RepresentationScreen({ plan, requests, agentId, onRequest, onRespond, onReleaseAgent, onSeePlans, onBack }: Props) {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sentTo, setSentTo] = useState<string | null>(null);

  const quota = quotaOf(plan, requests);
  const agent = agentId ? agentOf(agentId) : undefined;
  const invitations = requests.filter((r) => !r.byPlayer && r.status === "PENDING");
  const mine = requests.filter((r) => r.byPlayer);

  const send = (id: string) => {
    onRequest(id, message.trim());
    setSentTo(id);
    setOpenId(null);
    setMessage("");
  };

  const action = (a: Agent) => {
    const req = requests.find((r) => r.agentId === a.id && r.status === "PENDING");
    const left = cooldownLeft(requests, a.id);
    if (agentId === a.id) return { label: t("rep.representsYou"), disabled: true, tone: "ok" as const };
    if (req) return { label: t("rep.pending"), disabled: true, tone: "wait" as const };
    if (left > 0)
      return { label: t(left === 1 ? "rep.availableInOne" : "rep.availableIn", { days: left }), disabled: true, tone: "muted" as const };
    if (agentId) return { label: t("rep.hasAgent"), disabled: true, tone: "muted" as const };
    if (quota.limit === 0) return { label: t("rep.unlock"), disabled: true, tone: "muted" as const };
    if (quota.remaining === 0) return { label: t("rep.noLeft"), disabled: true, tone: "muted" as const };
    return { label: t("rep.ask"), disabled: false, tone: "go" as const };
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("rep.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.intro}>{t("rep.intro")}</Text>

        {agent && (
          <View style={styles.agentCard}>
            <Text style={styles.kicker}>{t("rep.currentAgent")}</Text>
            <Text style={styles.agentName}>
              {agent.flag} {agent.name}
            </Text>
            <Text style={styles.sub}>{agent.kind === "agency" ? t("rep.agency") : t("rep.agent")} · {tc(agent.country)}</Text>
            <Pressable onPress={onReleaseAgent} style={styles.ghost}>
              <Text style={styles.ghostText}>{t("rep.removeAgent")}</Text>
            </Pressable>
          </View>
        )}

        {invitations.length > 0 && (
          <>
            <Text style={styles.section}>{t("rep.inviteTitle")}</Text>
            {invitations.map((r) => {
              const a = agentOf(r.agentId);
              return (
                <View key={r.id} style={styles.card}>
                  <Text style={styles.agentName}>
                    {a?.flag} {a?.name ?? t("rep.agencyFallback")}
                  </Text>
                  <Text style={styles.sub}>{t("rep.inviteBody")}</Text>
                  <View style={styles.row}>
                    <Pressable onPress={() => onRespond(r.id, "REJECTED")} style={styles.ghost}>
                      <Text style={styles.ghostText}>{t("rep.reject")}</Text>
                    </Pressable>
                    <Pressable onPress={() => onRespond(r.id, "ACCEPTED")} style={styles.solid}>
                      <Text style={styles.solidText}>{t("rep.accept")}</Text>
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </>
        )}

        <Text style={styles.section}>{t("rep.agentsTitle")}</Text>
        {quota.limit > 0 ? (
          <Text style={styles.quota}>{t("rep.quotaLeft", { remaining: quota.remaining, limit: quota.limit })}</Text>
        ) : (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>{t("rep.needsPlan")}</Text>
            <Pressable onPress={onSeePlans} hitSlop={8}>
              <Text style={styles.link}>{t("rep.seePlans")}</Text>
            </Pressable>
          </View>
        )}
        {quota.limit > 0 && quota.remaining === 0 && <Text style={styles.noticeText}>{t("rep.noQuota")}</Text>}
        {sentTo && <Text style={styles.sentOk}>{t("rep.sentOk", { name: agentOf(sentTo)?.name ?? "" })}</Text>}

        {MOCK_AGENTS.map((a) => {
          const act = action(a);
          const open = openId === a.id;
          return (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{a.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.agentName}>{a.name}</Text>
                  <Text style={styles.sub}>
                    {a.kind === "agency" ? t("rep.agency") : t("rep.agent")} · {a.flag} {tc(a.country)}
                  </Text>
                </View>
              </View>
              {open ? (
                <View style={styles.form}>
                  <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder={t("rep.msgPlaceholder")}
                    placeholderTextColor={COLORS.subtle}
                    multiline
                    style={styles.input}
                  />
                  <Text style={styles.warn}>{t("rep.cooldownWarn", { days: REJECTION_COOLDOWN_DAYS })}</Text>
                  <View style={styles.row}>
                    <Pressable onPress={() => setOpenId(null)} style={styles.ghost}>
                      <Text style={styles.ghostText}>{t("rep.cancel")}</Text>
                    </Pressable>
                    <Pressable onPress={() => send(a.id)} style={styles.solid}>
                      <Text style={styles.solidText}>{t("rep.send")}</Text>
                    </Pressable>
                  </View>
                </View>
              ) : (
                <Pressable
                  disabled={act.disabled}
                  onPress={() => {
                    setOpenId(a.id);
                    setSentTo(null);
                  }}
                  style={[act.disabled ? styles.ghost : styles.solid, styles.full, act.disabled && { opacity: 0.7 }]}
                >
                  <Text style={act.disabled ? styles.ghostText : styles.solidText}>{act.label}</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {mine.length > 0 && (
          <>
            <Text style={styles.section}>{t("rep.mine", { count: mine.length })}</Text>
            {mine.map((r) => {
              const a = agentOf(r.agentId);
              const s = STATUS_STYLE[r.status];
              return (
                <View key={r.id} style={styles.mineRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.agentName}>{a?.name ?? t("rep.agencyFallback")}</Text>
                    {r.status === "REJECTED" && cooldownLeft(requests, r.agentId) > 0 && (
                      <Text style={styles.sub}>{t("rep.rejectedBody", { days: cooldownLeft(requests, r.agentId) })}</Text>
                    )}
                  </View>
                  <View style={[styles.pill, { backgroundColor: s.bg }]}>
                    <Text style={[styles.pillText, { color: s.fg }]}>{t(STATUS_KEY[r.status])}</Text>
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 16, paddingBottom: 40 },
  intro: { fontSize: 14, color: COLORS.muted, lineHeight: 20 },
  section: { fontSize: 15, fontWeight: "500", color: COLORS.ink, marginTop: 22, marginBottom: 10 },
  kicker: { fontSize: 11, color: COLORS.primaryDark, fontWeight: "500", letterSpacing: 0.5, textTransform: "uppercase" },
  agentCard: { marginTop: 16, padding: 14, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primaryBorder, backgroundColor: COLORS.primarySoft },
  card: { padding: 14, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.divider, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontWeight: "500", color: COLORS.muted },
  agentName: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  sub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  quota: { fontSize: 12, color: COLORS.muted, marginBottom: 10 },
  notice: { padding: 12, borderRadius: RADIUS.md, backgroundColor: COLORS.divider, marginBottom: 10 },
  noticeText: { fontSize: 13, color: COLORS.muted, lineHeight: 19 },
  link: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark, marginTop: 6 },
  sentOk: { fontSize: 13, color: COLORS.primaryDark, marginBottom: 10 },
  row: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 12 },
  ghost: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", marginTop: 0 },
  ghostText: { fontSize: 13, color: COLORS.ink },
  solid: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: "center" },
  solidText: { fontSize: 13, color: "#fff", fontWeight: "500" },
  full: { alignSelf: "stretch" },
  form: {},
  input: { minHeight: 70, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.sm, padding: 10, fontSize: 14, color: COLORS.ink, fontFamily: FONT.regular, textAlignVertical: "top" },
  warn: { fontSize: 11, color: COLORS.subtle, marginTop: 8 },
  mineRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.pill },
  pillText: { fontSize: 11, fontWeight: "500" },
});
