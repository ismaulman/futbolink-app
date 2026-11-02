import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import {
  Plans,
  RECRUIT_PLANS,
  RecruitPlan,
  Role,
  VISIBILITY_PLANS,
  VisibilityPlan,
} from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  role: Role;
  plans: Plans;
  onChange: (plans: Plans) => void;
  onBack: () => void;
};

const WEB_PLANS_URL = "https://futbolink.net/Subs";

function Capability({ label, allowed, needs }: { label: string; allowed: boolean; needs: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.cap}>
      <Ionicons
        name={allowed ? "checkmark-circle" : "lock-closed-outline"}
        size={20}
        color={allowed ? COLORS.primary : COLORS.subtle}
      />
      <View style={styles.capBody}>
        <Text style={styles.capLabel}>{label}</Text>
        {!allowed && <Text style={styles.capHint}>{t("plan.requires", { plan: needs })}</Text>}
      </View>
    </View>
  );
}

// Mi plan: solo muestra el plan y lo que habilita. Contratar o cambiar de plan
// se hace en la web (la app no vende ni muestra precios).
export default function PlanScreen({ role, plans, onChange, onBack }: Props) {
  const { t } = useTranslation();
  const showVisibility = role !== "agency";
  const showRecruit = role !== "player";
  const vRank = VISIBILITY_PLANS.indexOf(plans.visibility);
  const rRank = RECRUIT_PLANS.indexOf(plans.recruit);
  const vName = (p: VisibilityPlan) => t(`plan.visibility_${p}`);
  const rName = (p: RecruitPlan) => t(`plan.recruit_${p}`);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("plan.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {showVisibility && (
          <>
            <Text style={styles.section}>{t("plan.visibility")}</Text>
            <Text style={styles.current}>{vName(plans.visibility)}</Text>
            <Capability label={t("plan.capApply")} allowed={vRank >= 1} needs={vName("amateur")} />
            <Capability label={t("plan.capPremium")} allowed={vRank >= 2} needs={vName("semiprofesional")} />
          </>
        )}

        {showRecruit && (
          <>
            <Text style={styles.section}>{t("plan.recruit")}</Text>
            <Text style={styles.current}>{rName(plans.recruit)}</Text>
            <Capability label={t("plan.capMatch")} allowed={rRank >= 3} needs={rName("match")} />
            {role === "agency" && <Text style={styles.note}>{t("plan.agencyNote")}</Text>}
          </>
        )}

        <Pressable onPress={() => Linking.openURL(WEB_PLANS_URL)} style={styles.web}>
          <Ionicons name="open-outline" size={18} color={COLORS.ink} />
          <Text style={styles.webText}>{t("plan.manageWeb")}</Text>
        </Pressable>

        <Text style={styles.testTitle}>{t("plan.test")}</Text>
        {showVisibility && (
          <View style={styles.chips}>
            {VISIBILITY_PLANS.map((p) => (
              <Pressable
                key={p}
                onPress={() => onChange({ ...plans, visibility: p })}
                style={[styles.chip, plans.visibility === p && styles.chipActive]}
              >
                <Text style={[styles.chipText, plans.visibility === p && styles.chipTextActive]}>{vName(p)}</Text>
              </Pressable>
            ))}
          </View>
        )}
        {showRecruit && (
          <View style={styles.chips}>
            {RECRUIT_PLANS.map((p) => (
              <Pressable
                key={p}
                onPress={() => onChange({ ...plans, recruit: p })}
                style={[styles.chip, plans.recruit === p && styles.chipActive]}
              >
                <Text style={[styles.chipText, plans.recruit === p && styles.chipTextActive]}>{rName(p)}</Text>
              </Pressable>
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
  section: { fontSize: 13, color: COLORS.muted, marginTop: 20, marginBottom: 4 },
  current: { fontSize: 24, fontWeight: "500", color: COLORS.ink, marginBottom: 8 },
  cap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  capBody: { flex: 1 },
  capLabel: { fontSize: 15, color: COLORS.ink },
  capHint: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  note: { fontSize: 13, color: COLORS.muted, marginTop: 10, lineHeight: 18 },
  web: {
    marginTop: 24,
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  webText: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  testTitle: { fontSize: 12, color: COLORS.subtle, marginTop: 28, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primaryBorder },
  chipText: { fontSize: 13, color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark, fontWeight: "500" },
});
