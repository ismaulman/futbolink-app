import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import VideoList from "../components/VideoList";
import PositionPitch from "../components/PositionPitch";
import ScreenHeader from "../components/ScreenHeader";
import { Folder, Player, Role } from "../data";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Props = {
  player: Player;
  viewerRole: Role;
  saved: boolean;
  proposalSent: boolean;
  onToggleSave: () => void;
  onSendProposal: () => void;
  folders: Folder[];
  onToggleFolder: (folderId: string) => void;
  onBack: () => void;
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function PlayerProfileScreen({
  player,
  viewerRole,
  saved,
  proposalSent,
  onToggleSave,
  onSendProposal,
  folders,
  onToggleFolder,
  onBack,
}: Props) {
  const { t } = useTranslation();
  // El Futbolista no recluta: solo los ofertantes envían propuestas.
  const canPropose = viewerRole !== "player";

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("player.profile")}
        onBack={onBack}
        right={
          <Pressable
            onPress={onToggleSave}
            hitSlop={10}
            accessibilityLabel={saved ? t("player.unsave") : t("player.save")}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={22}
              color={saved ? COLORS.primary : COLORS.ink}
            />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(player.name)}</Text>
          </View>
          <View style={styles.heroBody}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{player.name}</Text>
              {player.verified && (
                <Ionicons name="checkmark-circle" size={18} color={COLORS.primaryDark} />
              )}
            </View>
            <Text style={styles.sub}>
              {tc(player.position)} · {t("player.age", { count: player.age })}
            </Text>
            <Text style={styles.meta}>
              {player.flag} {tc(player.country)} · {player.club}
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{player.views}</Text>
            <Text style={styles.statLabel}>{t("profile.views")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{player.videos}</Text>
            <Text style={styles.statLabel}>{t("profile.videos")}</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{tc(player.category)}</Text>
            <Text style={styles.statLabel}>{t("offer.category")}</Text>
          </View>
        </View>

        <Text style={styles.section}>{t("profile.position")}</Text>
        <View style={styles.positionRow}>
          <PositionPitch position={player.position} secondary={player.secondaryPosition} />
          <View style={styles.positionText}>
            <Text style={styles.positionLabel}>{t("profile.position")}</Text>
            <Text style={styles.positionMain}>{tc(player.position)}</Text>
            {player.secondaryPosition && (
              <>
                <Text style={[styles.positionLabel, styles.positionGap]}>
                  {t("profile.secondaryPosition")}
                </Text>
                <Text style={styles.positionSecondary}>{tc(player.secondaryPosition)}</Text>
              </>
            )}
          </View>
        </View>

        <Text style={styles.section}>{t("profile.info")}</Text>
        <View style={styles.list}>
          <InfoRow label={t("profile.height")} value={player.height} />
          <InfoRow label={t("profile.weight")} value={`${player.weightKg} kg`} />
          <InfoRow label={t("profile.foot")} value={tc(player.foot)} />
          <InfoRow label={t("profile.nationality")} value={tc(player.country)} />
          <InfoRow label={t("profile.currentClub")} value={player.club} />
        </View>

        <Text style={styles.section}>{t("video.title")}</Text>
        {player.videoUrls && player.videoUrls.length > 0 ? (
          <VideoList urls={player.videoUrls} />
        ) : (
          <Text style={styles.positionLabel}>{t("video.none")}</Text>
        )}

        <Text style={styles.section}>{t("profile.career")}</Text>
        <View style={styles.list}>
          {player.career.map((item) => (
            <View key={item.years + item.club} style={styles.careerRow}>
              <View style={styles.careerDot} />
              <View style={styles.careerBody}>
                <Text style={styles.careerClub}>{item.club}</Text>
                <Text style={styles.careerDetail}>
                  {item.detail} · {item.years}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {canPropose && (
          <>
            <Text style={styles.section}>{t("folders.inProfile")}</Text>
            {folders.length === 0 ? (
              <Text style={styles.positionLabel}>{t("folders.noneYet")}</Text>
            ) : (
              <View style={styles.folderChips}>
                {folders.map((folder) => {
                  const active = folder.playerIds.includes(player.id);
                  return (
                    <Pressable
                      key={folder.id}
                      onPress={() => onToggleFolder(folder.id)}
                      style={[styles.folderChip, active && styles.folderChipActive]}
                    >
                      <Ionicons
                        name={active ? "folder" : "folder-outline"}
                        size={15}
                        color={active ? COLORS.primaryDark : COLORS.muted}
                      />
                      <Text style={[styles.folderText, active && styles.folderTextActive]}>
                        {folder.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {canPropose && (
        <View style={styles.footer}>
          <Pressable
            onPress={onSendProposal}
            disabled={proposalSent}
            style={({ pressed }) => [
              styles.button,
              proposalSent && styles.buttonDone,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.buttonText, proposalSent && styles.buttonTextDone]}>
              {proposalSent ? t("player.proposalSent") : t("player.sendProposal")}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  hero: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, color: COLORS.primaryDark },
  heroBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 18, fontWeight: "500", color: COLORS.ink, flexShrink: 1 },
  sub: { fontSize: 14, color: COLORS.ink, marginTop: 2 },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  stats: {
    flexDirection: "row",
    marginTop: 18,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 24, marginBottom: 8 },
  positionRow: { flexDirection: "row", alignItems: "center", gap: 20 },
  positionText: { flex: 1 },
  positionLabel: { fontSize: 12, color: COLORS.muted },
  positionGap: { marginTop: 12 },
  positionMain: { fontSize: 17, fontWeight: "500", color: COLORS.primaryDark, marginTop: 2 },
  positionSecondary: { fontSize: 14, color: COLORS.ink, marginTop: 2 },
  list: { borderTopWidth: 1, borderTopColor: COLORS.divider },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: { fontSize: 14, color: COLORS.muted },
  infoValue: { flex: 1, fontSize: 14, color: COLORS.ink, textAlign: "right" },
  careerRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  careerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  careerBody: { flex: 1 },
  careerClub: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  careerDetail: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  folderChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  folderChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  folderChipActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primaryBorder },
  folderText: { fontSize: 13, color: COLORS.muted },
  folderTextActive: { color: COLORS.primaryDark },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  button: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDone: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  buttonTextDone: { color: COLORS.primaryDark },
});
