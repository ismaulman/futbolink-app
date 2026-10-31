import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import { Folder, MyOffer } from "../data";
import { timeAgo } from "../i18n/format";
import { COLORS, RADIUS } from "../theme";

type Props = {
  offers: MyOffer[];
  folders: Folder[];
  onPublish: () => void;
  onOpenOffer: (offer: MyOffer) => void;
  onOpenFolders: () => void;
  // Solo agencias: acceso al portafolio de jugadores representados.
  portfolioCount?: number;
  onOpenPortfolio?: () => void;
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function PanelScreen({
  offers,
  folders,
  onPublish,
  onOpenOffer,
  onOpenFolders,
  portfolioCount,
  onOpenPortfolio,
}: Props) {
  const { t } = useTranslation();
  const allCandidates = offers.flatMap((o) => o.candidates);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.titleRow}>
        <Text style={styles.heading}>{t("panel.title")}</Text>
      </View>

      <View style={styles.stats}>
        <Stat value={offers.filter((o) => o.status === "ACTIVE").length} label={t("panel.activeOffers")} />
        <Stat value={allCandidates.length} label={t("panel.candidates")} />
        <Stat value={allCandidates.filter((c) => c.interested).length} label={t("panel.interested")} />
      </View>

      <Pressable
        onPress={onPublish}
        style={({ pressed }) => [styles.publish, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="add" size={20} color={COLORS.white} />
        <Text style={styles.publishText}>{t("panel.publish")}</Text>
      </Pressable>

      <Text style={styles.section}>{t("panel.myOffers")}</Text>
      {offers.length === 0 ? (
        <Text style={styles.empty}>{t("panel.noOffers")}</Text>
      ) : (
        <View style={styles.list}>
          {offers.map((offer) => {
            const unreviewed = offer.candidates.filter((c) => !c.viewed).length;
            return (
              <Pressable
                key={offer.id}
                onPress={() => onOpenOffer(offer)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {offer.title}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {t("myStatus." + offer.status)} · {timeAgo(t, offer.postedHoursAgo)}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {t("panel.candidatesCount", { count: offer.candidates.length })}
                    {unreviewed > 0 ? ` · ${t("panel.unreviewed", { count: unreviewed })}` : ""}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
              </Pressable>
            );
          })}
        </View>
      )}

      {onOpenPortfolio && (
        <Pressable
          onPress={onOpenPortfolio}
          style={({ pressed }) => [styles.folderRow, pressed && styles.rowPressed]}
        >
          <Ionicons name="people-outline" size={22} color={COLORS.ink} />
          <View style={styles.rowBody}>
            <Text style={styles.rowTitle}>{t("portfolio.title")}</Text>
            <Text style={styles.rowMeta}>{t("portfolio.count", { count: portfolioCount ?? 0 })}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
        </Pressable>
      )}

      <Pressable
        onPress={onOpenFolders}
        style={({ pressed }) => [styles.folderRow, pressed && styles.rowPressed]}
      >
        <Ionicons name="folder-outline" size={22} color={COLORS.ink} />
        <View style={styles.rowBody}>
          <Text style={styles.rowTitle}>{t("folders.title")}</Text>
          <Text style={styles.rowMeta}>{t("panel.foldersCount", { count: folders.length })}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  titleRow: { marginBottom: 4 },
  heading: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  stats: {
    flexDirection: "row",
    marginTop: 14,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  publish: {
    marginTop: 16,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  publishText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 24, marginBottom: 4 },
  empty: { fontSize: 14, color: COLORS.muted, marginTop: 8 },
  list: { borderTopWidth: 1, borderTopColor: COLORS.divider },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowPressed: { backgroundColor: COLORS.surface },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, color: COLORS.ink },
  rowMeta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  folderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
});
