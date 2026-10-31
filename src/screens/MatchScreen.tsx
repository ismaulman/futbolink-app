import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ChipGroup from "../components/ChipGroup";
import Field from "../components/Field";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { Player, POSITIONS } from "../data";
import { tc } from "../i18n";
import { DimensionStatus, MatchCriteria, MatchResult, runMatch } from "../match";
import { COLORS, RADIUS } from "../theme";

type Props = {
  onOpenPlayer: (player: Player) => void;
  onBack: () => void;
};

const STATUS_ICON: Record<DimensionStatus, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
  match: { name: "checkmark-circle", color: COLORS.primary },
  partial: { name: "alert-circle", color: COLORS.warning },
  miss: { name: "close-circle", color: COLORS.danger },
};

const toNumber = (value: string) => {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
};

// Recruit Match: el reclutador describe qué busca y la app ordena a los
// jugadores por % de compatibilidad, explicando cada punto.
export default function MatchScreen({ onOpenPlayer, onBack }: Props) {
  const { t } = useTranslation();
  const [position, setPosition] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [euPassport, setEuPassport] = useState("any");
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<MatchResult[] | null>(null);

  const search = () => {
    if (!position) return setError(t("match.errPosition"));
    setError("");
    const criteria: MatchCriteria = {
      position,
      minAge: toNumber(minAge),
      maxAge: toNumber(maxAge),
      euPassport: euPassport === "eu",
      category: category as MatchCriteria["category"],
    };
    setResults(runMatch(criteria));
  };

  if (results) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title={t("match.results")} onBack={() => setResults(null)} />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.hint}>{t("match.searching", { position: tc(position) })}</Text>
          {results.map(({ player, score, breakdown }) => (
            <View key={player.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Pressable style={styles.cardBody} onPress={() => onOpenPlayer(player)}>
                  <Text style={styles.name}>{player.name}</Text>
                  <Text style={styles.meta}>
                    {tc(player.position)} · {t("player.age", { count: player.age })} · {player.flag} {tc(player.country)}
                  </Text>
                </Pressable>
                <Text style={[styles.score, score < 50 && styles.scoreLow]}>{score}%</Text>
              </View>
              {breakdown.map((d) => (
                <View key={d.key} style={styles.line}>
                  <Ionicons name={STATUS_ICON[d.status].name} size={16} color={STATUS_ICON[d.status].color} />
                  <Text style={styles.lineText}>{t(`match.${d.key}_${d.status}`)}</Text>
                </View>
              ))}
            </View>
          ))}
          <Text style={styles.disclaimer}>{t("match.disclaimer")}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("match.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.hint}>{t("match.intro")}</Text>
        <ChipGroup
          label={t("match.positionLabel")}
          value={position}
          onChange={setPosition}
          options={POSITIONS.filter((p) => p !== "Todas").map((p) => ({ value: p, label: tc(p) }))}
        />
        <View style={styles.ageRow}>
          <View style={styles.ageCol}>
            <Field label={t("match.minAge")} value={minAge} onChangeText={setMinAge} keyboardType="number-pad" />
          </View>
          <View style={styles.ageCol}>
            <Field label={t("match.maxAge")} value={maxAge} onChangeText={setMaxAge} keyboardType="number-pad" />
          </View>
        </View>
        <ChipGroup
          label={t("match.citizenship")}
          value={euPassport}
          onChange={setEuPassport}
          options={[
            { value: "any", label: t("match.anyPassport") },
            { value: "eu", label: t("match.euPassport") },
          ]}
        />
        <ChipGroup
          label={t("match.category")}
          value={category}
          onChange={setCategory}
          options={[
            { value: "", label: t("match.anyCategory") },
            { value: "Amateur", label: tc("Amateur") },
            { value: "Semiprofesional", label: tc("Semiprofesional") },
            { value: "Profesional", label: tc("Profesional") },
          ]}
        />
        {error !== "" && <Text style={styles.error}>{error}</Text>}
        <Pressable onPress={search} style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}>
          <Text style={styles.submitText}>{t("match.search")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  hint: { fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 18 },
  ageRow: { flexDirection: "row", gap: 12 },
  ageCol: { flex: 1 },
  error: { fontSize: 13, color: COLORS.danger, marginBottom: 12 },
  submit: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  card: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  cardBody: { flex: 1 },
  name: { fontSize: 16, color: COLORS.ink },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  score: { fontSize: 22, fontWeight: "500", color: COLORS.primaryDark },
  scoreLow: { color: COLORS.muted },
  line: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 2 },
  lineText: { flex: 1, fontSize: 13, color: COLORS.ink },
  disclaimer: { fontSize: 12, color: COLORS.muted, marginTop: 16, lineHeight: 17 },
});
