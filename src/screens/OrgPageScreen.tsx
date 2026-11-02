import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { MOCK_PLAYERS, ORG_SOCIALS, OrgPage } from "../data";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";
import { STATUS_KEY } from "./OrgPagesScreen";

type Props = {
  page: OrgPage;
  // Jugadores representados (solo páginas de agencia).
  portfolioPlayerIds: string[];
  onEdit: () => void;
  onBack: () => void;
};

const SOCIAL_ICON = {
  instagram: "logo-instagram",
  twitter: "logo-twitter",
  youtube: "logo-youtube",
  facebook: "logo-facebook",
  tiktok: "logo-tiktok",
} as const;

// Página de la organización como la ve el público, con acceso a editarla.
export default function OrgPageScreen({ page, portfolioPlayerIds, onEdit, onBack }: Props) {
  const { t } = useTranslation();
  const approved = page.status === "APPROVED";
  const socials = ORG_SOCIALS.filter((key) => page[key] !== "");
  const players = portfolioPlayerIds
    .map((id) => MOCK_PLAYERS.find((p) => p.id === id))
    .filter((p) => p !== undefined);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={page.name} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>{page.name.slice(0, 1).toUpperCase()}</Text>
          </View>
          <View style={styles.topBody}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{page.name}</Text>
              {approved && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
            </View>
            <Text style={styles.meta}>{t(`org.type${page.type}`)}</Text>
            <Text style={styles.meta}>{[page.region, tc(page.country)].filter(Boolean).join(", ")}</Text>
          </View>
        </View>

        {!approved && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              {page.status === "REJECTED"
                ? t("org.ownerBannerRejected")
                : page.status === "PENDING_REVIEW"
                  ? t("org.pendingApprovalToast")
                  : t(`org.${STATUS_KEY[page.status]}`)}
            </Text>
            {page.rejectionReason ? (
              <Text style={styles.bannerText}>
                {t("org.rejectionReasonLabelInline")} {page.rejectionReason}
              </Text>
            ) : null}
          </View>
        )}

        <Pressable onPress={onEdit} style={({ pressed }) => [styles.edit, pressed && { opacity: 0.7 }]}>
          <Text style={styles.editText}>{t("org.editPage")}</Text>
        </Pressable>

        {page.description !== "" && <Text style={styles.description}>{page.description}</Text>}
        {page.foundationYear !== "" && (
          <Text style={styles.meta}>
            {t("org.founded")} {page.foundationYear}
          </Text>
        )}

        {(page.website || page.contactEmail || page.phone || socials.length > 0) && (
          <>
            <Text style={styles.section}>{t("org.contact")}</Text>
            {page.website !== "" && (
              <Pressable onPress={() => Linking.openURL(page.website)} style={styles.line}>
                <Ionicons name="globe-outline" size={18} color={COLORS.ink} />
                <Text style={styles.lineText}>{page.website}</Text>
              </Pressable>
            )}
            {page.contactEmail !== "" && (
              <View style={styles.line}>
                <Ionicons name="mail-outline" size={18} color={COLORS.ink} />
                <Text style={styles.lineText}>{page.contactEmail}</Text>
              </View>
            )}
            {page.phone !== "" && (
              <View style={styles.line}>
                <Ionicons name="call-outline" size={18} color={COLORS.ink} />
                <Text style={styles.lineText}>{page.phone}</Text>
              </View>
            )}
            {socials.map((key) => (
              <View key={key} style={styles.line}>
                <Ionicons name={SOCIAL_ICON[key]} size={18} color={COLORS.ink} />
                <Text style={styles.lineText}>{page[key]}</Text>
              </View>
            ))}
          </>
        )}

        {page.type === "AGENCY" && (
          <>
            <Text style={styles.section}>{t("org.portfolioTitle")}</Text>
            {players.length === 0 ? (
              <Text style={styles.meta}>{t("org.noPlayersRepresented")}</Text>
            ) : (
              players.map((p) => (
                <View key={p.id} style={styles.line}>
                  <Text style={styles.lineText}>{p.name}</Text>
                  <Text style={styles.meta}>{tc(p.position)}</Text>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  top: { flexDirection: "row", gap: 14, alignItems: "center" },
  logo: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 30, fontWeight: "500", color: COLORS.primaryDark },
  topBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 20, fontWeight: "500", color: COLORS.ink, flexShrink: 1 },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  banner: { marginTop: 16, padding: 12, borderRadius: RADIUS.md, backgroundColor: COLORS.surface, gap: 4 },
  bannerText: { fontSize: 13, color: COLORS.ink, lineHeight: 18 },
  edit: {
    marginTop: 16,
    height: 36,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  editText: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  description: { fontSize: 15, color: COLORS.ink, lineHeight: 22, marginTop: 18, marginBottom: 6 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 22, marginBottom: 4 },
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  lineText: { flex: 1, fontSize: 14, color: COLORS.ink },
});
