import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import PositionPitch from "../components/PositionPitch";
import ScreenHeader from "../components/ScreenHeader";
import { sortCareer } from "../career";
import { Profile, User } from "../data";
import { COLORS, RADIUS } from "../theme";

const LANGS = ["es", "en", "it", "pt"] as const;
type Lang = (typeof LANGS)[number];

type Props = {
  user: User;
  profile: Profile;
  verified: boolean;
  onBack: () => void;
};

// Mi CV: la ficha del jugador (o CV profesional del staff) lista para compartir.
// El CV tiene su propio idioma, independiente del de la app (como en la web).
export default function CVScreen({ user, profile, verified, onBack }: Props) {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState<Lang>((LANGS as readonly string[]).includes(i18n.language) ? (i18n.language as Lang) : "es");
  const L = (key: string) => t(key, { lng: lang });
  const C = (value: string) => t(`catalog.${value}`, { lng: lang });

  const isPlayer = user.role === "player";
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel = user.puesto
    ? t(`puesto.${user.puesto}`, { lng: lang, defaultValue: user.puesto })
    : t(`role.${user.role}.label`, { lng: lang });

  const data: [string, string][] = [
    [L("cv.nationality"), profile.nationality ? C(profile.nationality) : ""],
    [L("cv.residence"), profile.location],
    ...(isPlayer
      ? ([
          [L("cv.height"), profile.heightCm ? `${profile.heightCm} cm` : ""],
          [L("cv.weight"), profile.weightKg ? `${profile.weightKg} kg` : ""],
          [L("cv.foot"), profile.foot ? C(profile.foot) : ""],
        ] as [string, string][])
      : []),
  ].filter(([, v]) => !!v) as [string, string][];

  const share = () => {
    const lines = [
      user.name,
      isPlayer && profile.position ? C(profile.position) : roleLabel,
      ...data.map(([k, v]) => `${k}: ${v}`),
      ...(profile.videoUrls ?? []),
      user.email,
      profile.phone,
    ].filter(Boolean);
    Share.share({ message: lines.join("\n") });
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("cv.open")}
        onBack={onBack}
        right={
          <Pressable onPress={share} hitSlop={8} style={styles.shareBtn}>
            <Ionicons name="share-outline" size={18} color={COLORS.primaryDark} />
            <Text style={styles.shareText}>{t("cv.share")}</Text>
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.langRow}>
          <Text style={styles.langLabel}>{t("cv.language")}</Text>
          {LANGS.map((l) => (
            <Pressable key={l} onPress={() => setLang(l)} style={[styles.langChip, lang === l && styles.langChipOn]}>
              <Text style={[styles.langText, lang === l && styles.langTextOn]}>{l.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sheet}>
          <Text style={styles.kicker}>{isPlayer ? L("cv.title") : L("cv.titleStaff")}</Text>
          <View style={styles.head}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.headBody}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{user.name}</Text>
                {verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
              </View>
              <Text style={styles.role}>{isPlayer && profile.position ? C(profile.position) : roleLabel}</Text>
              {verified && <Text style={styles.verified}>{L("cv.verifiedBy")}</Text>}
            </View>
          </View>

          <Text style={styles.section}>{isPlayer ? L("cv.data") : L("cv.contact")}</Text>
          {data.map(([k, v]) => (
            <View key={k} style={styles.row}>
              <Text style={styles.rowLabel}>{k}</Text>
              <Text style={styles.rowValue}>{v}</Text>
            </View>
          ))}

          {isPlayer && !!profile.position && (
            <>
              <Text style={styles.section}>{L("cv.positions")}</Text>
              <View style={styles.positions}>
                <PositionPitch position={profile.position} secondary={profile.secondaryPosition || undefined} />
                <View style={styles.posBody}>
                  <Text style={styles.rowLabel}>{L("cv.primary")}</Text>
                  <Text style={styles.rowValue}>{C(profile.position)}</Text>
                  {!!profile.secondaryPosition && (
                    <>
                      <Text style={[styles.rowLabel, { marginTop: 12 }]}>{L("cv.secondary")}</Text>
                      <Text style={styles.rowValue}>{C(profile.secondaryPosition)}</Text>
                    </>
                  )}
                </View>
              </View>
            </>
          )}

          <Text style={styles.section}>{L("cv.career")}</Text>
          {sortCareer(profile.career).map((item) => (
            <View key={item.id} style={styles.careerRow}>
              <View style={styles.dot} />
              <View style={styles.headBody}>
                <Text style={styles.rowValueLeft}>{item.club}</Text>
                <Text style={styles.rowLabel}>
                  {[item.country, item.league, item.category].filter(Boolean).join(" · ")}
                </Text>
                <Text style={styles.rowLabel}>
                  {item.start} – {item.end || L("career.present")}
                </Text>
              </View>
            </View>
          ))}

          {(profile.videoUrls?.length ?? 0) > 0 && (
            <>
              <Text style={styles.section}>{L("cv.videos")}</Text>
              {profile.videoUrls.map((url) => (
                <Text key={url} style={styles.link} numberOfLines={1}>
                  {url}
                </Text>
              ))}
            </>
          )}

          <Text style={styles.section}>{L("cv.contact")}</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>{L("cv.email")}</Text>
            <Text style={styles.rowValue}>{user.email}</Text>
          </View>
          {!!profile.phone && (
            <View style={styles.row}>
              <Text style={styles.rowLabel}>{L("cv.phone")}</Text>
              <Text style={styles.rowValue}>{profile.phone}</Text>
            </View>
          )}
          <Text style={styles.footer}>FutboLink · {L("cv.online")}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.surface },
  content: { padding: 16, paddingBottom: 32 },
  shareBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  shareText: { fontSize: 14, fontWeight: "500", color: COLORS.primaryDark },
  langRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  langLabel: { fontSize: 13, color: COLORS.muted, marginRight: 4 },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.pill, borderWidth: 1, borderColor: COLORS.border },
  langChipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  langText: { fontSize: 12, fontWeight: "500", color: COLORS.muted },
  langTextOn: { color: "#fff" },
  sheet: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 16 },
  kicker: { fontSize: 11, fontWeight: "500", color: COLORS.primaryDark, letterSpacing: 0.6, textTransform: "uppercase" },
  head: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 12 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.primarySoft, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22, fontWeight: "500", color: COLORS.primaryDark },
  headBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 19, fontWeight: "500", color: COLORS.ink },
  role: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  verified: { fontSize: 12, color: COLORS.primaryDark, marginTop: 2 },
  section: { fontSize: 11, fontWeight: "500", color: COLORS.subtle, letterSpacing: 0.6, marginTop: 22, marginBottom: 6 },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 12, paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  rowLabel: { fontSize: 12, color: COLORS.muted },
  rowValue: { fontSize: 14, fontWeight: "500", color: COLORS.ink, flexShrink: 1, textAlign: "right" },
  rowValueLeft: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  positions: { flexDirection: "row", gap: 16, alignItems: "center" },
  posBody: { flex: 1 },
  careerRow: { flexDirection: "row", gap: 12, paddingVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 6 },
  link: { fontSize: 13, color: COLORS.primaryDark, paddingVertical: 3 },
  footer: { fontSize: 12, color: COLORS.subtle, textAlign: "center", marginTop: 24 },
});
