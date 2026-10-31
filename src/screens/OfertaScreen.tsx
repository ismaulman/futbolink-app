import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Text from "../components/AppText";
import { Offer } from "../data";
import { timeAgo } from "../i18n/format";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";
import { useTranslation } from "react-i18next";

type Props = {
  offer: Offer;
  applied: boolean;
  onBack: () => void;
  onApply: () => void;
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function OfertaScreen({ offer, applied, onBack, onApply }: Props) {
  const { t } = useTranslation();
  const ageText =
    offer.minAge && offer.maxAge
      ? t("offer.ageRange", { min: offer.minAge, max: offer.maxAge })
      : offer.minAge
        ? t("offer.ageFrom", { min: offer.minAge })
        : offer.maxAge
          ? t("offer.ageTo", { max: offer.maxAge })
          : t("offer.noLimit");
  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
        </Pressable>
        <Text style={styles.topTitle}>{t("offer.title")}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.location}>
          {offer.flag} {tc(offer.country)} · {offer.region}
        </Text>
        <Text style={styles.title}>{offer.title}</Text>
        <Text style={styles.club}>
          {offer.club} · {offer.league}
        </Text>

        <Text style={styles.salary}>{offer.salary}</Text>

        <View style={styles.list}>
          <Row
            label={offer.type === "player" ? t("offer.positions") : t("offer.role")}
            value={offer.positions.map(tc).join(", ")}
          />
          <Row label={t("offer.category")} value={tc(offer.category)} />
          <Row label={t("offer.contract")} value={offer.contractDuration} />
          <Row label={t("offer.gender")} value={tc(offer.sportGenres)} />
          <Row label={t("offer.minExperience")} value={tc(offer.minExperience)} />
          <Row label={t("offer.age")} value={ageText} />
          <Row
            label={t("offer.euPassport")}
            value={offer.euPassport === "Si" ? t("offer.euRequired") : t("offer.euNotRequired")}
          />
          <Row
            label={t("offer.travel")}
            value={offer.availabilityToTravel === "Si" ? t("common.yes") : t("common.no")}
          />
        </View>

        <Text style={styles.sectionTitle}>{t("offer.description")}</Text>
        <Text style={styles.body}>{offer.description}</Text>

        <Text style={styles.sectionTitle}>{t("offer.skills")}</Text>
        {offer.requirements.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Ionicons name="checkmark" size={16} color={COLORS.primaryDark} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>{t("offer.benefits")}</Text>
        {offer.extras.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Ionicons name="add-circle-outline" size={16} color={COLORS.primaryDark} />
            <Text style={styles.bulletText}>{tc(item)}</Text>
          </View>
        ))}

        <Text style={styles.posted}>{timeAgo(t, offer.postedHoursAgo)}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={onApply}
          disabled={applied}
          style={({ pressed }) => [
            styles.applyButton,
            applied && styles.appliedButton,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={[styles.applyText, applied && styles.appliedText]}>
            {applied ? t("offer.appliedFull") : t("offer.applyNow")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  content: { padding: 16, paddingBottom: 24 },
  location: { fontSize: 12, color: COLORS.muted },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: COLORS.ink,
    marginTop: 4,
  },
  club: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  salary: { fontSize: 18, fontWeight: "500", color: COLORS.ink, marginTop: 12 },
  list: { marginTop: 12, borderTopWidth: 1, borderTopColor: COLORS.divider },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowLabel: { fontSize: 14, color: COLORS.muted },
  rowValue: { flex: 1, fontSize: 14, color: COLORS.ink, textAlign: "right" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.ink,
    marginTop: 20,
    marginBottom: 8,
  },
  body: { fontSize: 14, lineHeight: 21, color: COLORS.ink },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20, color: COLORS.ink },
  posted: { fontSize: 12, color: COLORS.muted, marginTop: 20 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  appliedButton: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  applyText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  appliedText: { color: COLORS.primaryDark },
});
