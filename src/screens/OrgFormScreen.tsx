import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Field from "../components/Field";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { EMPTY_ORG, ORG_SOCIALS, ORG_TYPES, OrgPage } from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  // null = crear una página nueva; si viene una página, se edita.
  page: OrgPage | null;
  onSubmit: (data: Omit<OrgPage, "id" | "status">) => void;
  onBack: () => void;
};

type Step = 1 | 2 | 3 | 4;

// Crear/editar página de organización en 4 pasos (Tipo, Información, Detalles, Revisión),
// igual que el asistente de la web.
export default function OrgFormScreen({ page, onSubmit, onBack }: Props) {
  const { t } = useTranslation();
  const editing = page !== null;
  const [step, setStep] = useState<Step>(editing ? 2 : 1);
  const [draft, setDraft] = useState<Omit<OrgPage, "id" | "status">>(page ?? EMPTY_ORG);
  const [error, setError] = useState("");

  const update = (patch: Partial<typeof draft>) => setDraft((d) => ({ ...d, ...patch }));

  const next = () => {
    if (step === 2) {
      if (!draft.name.trim()) return setError(t("org.nameRequired"));
      if (!draft.country.trim()) return setError(t("org.countryRequired"));
    }
    setError("");
    setStep((step + 1) as Step);
  };

  const back = () => {
    setError("");
    if (step === (editing ? 2 : 1)) onBack();
    else setStep((step - 1) as Step);
  };

  const labels = [t("org.stepLabel1"), t("org.stepLabel2"), t("org.stepLabel3"), t("org.stepLabel4")];
  const title = editing ? t("org.editPageTitle") : t("org.createTitle");

  return (
    <View style={styles.screen}>
      <ScreenHeader title={title} onBack={back} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.bar}>
          {labels.map((label, i) => (
            <View key={label} style={styles.barItem}>
              <View style={[styles.barLine, i + 1 <= step && styles.barLineActive]} />
              <Text style={[styles.barText, i + 1 === step && styles.barTextActive]}>{label}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <>
            <Text style={styles.heading}>{t("org.step1Title")}</Text>
            {ORG_TYPES.map((type) => {
              const active = draft.type === type;
              return (
                <Pressable
                  key={type}
                  onPress={() => update({ type })}
                  style={[styles.typeRow, active && styles.typeRowActive]}
                >
                  <Ionicons
                    name={active ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={active ? COLORS.primaryDark : COLORS.subtle}
                  />
                  <View style={styles.typeBody}>
                    <Text style={styles.typeName}>{t(`org.type${type}`)}</Text>
                    <Text style={styles.typeDesc}>{t(`org.type${type}Desc`)}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.heading}>{t("org.step2Title")}</Text>
            <Field
              label={t("org.name")}
              value={draft.name}
              placeholder={t("org.namePlaceholder")}
              onChangeText={(v) => update({ name: v })}
            />
            <Field label={t("org.country")} value={draft.country} onChangeText={(v) => update({ country: v })} />
            <Field
              label={t("org.region")}
              value={draft.region}
              placeholder={t("org.regionPlaceholder")}
              onChangeText={(v) => update({ region: v })}
            />
            <Field
              label={t("org.foundationYear")}
              value={draft.foundationYear}
              placeholder={t("org.foundationYearPlaceholder")}
              keyboardType="number-pad"
              onChangeText={(v) => update({ foundationYear: v.replace(/[^0-9]/g, "").slice(0, 4) })}
            />
            <Field
              label={t("org.description")}
              value={draft.description}
              placeholder={t("org.descriptionPlaceholder")}
              multiline
              style={styles.multiline}
              onChangeText={(v) => update({ description: v.slice(0, 500) })}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.heading}>{t("org.step3Title")}</Text>
            <Field
              label={t("org.website")}
              value={draft.website}
              placeholder={t("org.websitePlaceholder")}
              autoCapitalize="none"
              keyboardType="url"
              onChangeText={(v) => update({ website: v })}
            />
            <Field
              label={t("org.contactEmail")}
              value={draft.contactEmail}
              placeholder={t("org.contactEmailPlaceholder")}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(v) => update({ contactEmail: v })}
            />
            <Field label={t("org.phone")} value={draft.phone} keyboardType="phone-pad" onChangeText={(v) => update({ phone: v })} />
            <Text style={styles.subheading}>{t("org.socialMedia")}</Text>
            {ORG_SOCIALS.map((key) => (
              <Field
                key={key}
                label={t(`org.${key}`)}
                value={draft[key]}
                autoCapitalize="none"
                onChangeText={(v) => update({ [key]: v })}
              />
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.heading}>{t("org.step4Title")}</Text>
            <Text style={styles.hint}>{t("org.reviewHint")}</Text>
            <View style={styles.review}>
              <Text style={styles.reviewName}>{draft.name}</Text>
              <Text style={styles.hint}>
                {t(`org.type${draft.type}`)} · {[draft.region, draft.country].filter(Boolean).join(", ")}
              </Text>
              {draft.foundationYear !== "" && (
                <Text style={styles.hint}>
                  {t("org.founded")} {draft.foundationYear}
                </Text>
              )}
              {draft.description !== "" && <Text style={styles.reviewText}>{draft.description}</Text>}
            </View>
          </>
        )}

        {error !== "" && <Text style={styles.error}>{error}</Text>}
        <Pressable
          onPress={step === 4 ? () => onSubmit({ ...draft, name: draft.name.trim() }) : next}
          style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.submitText}>
            {step === 4 ? (editing ? t("org.saveChanges") : t("org.publish")) : t("org.next")}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  bar: { flexDirection: "row", gap: 6, marginBottom: 18 },
  barItem: { flex: 1 },
  barLine: { height: 3, borderRadius: 2, backgroundColor: COLORS.divider, marginBottom: 6 },
  barLineActive: { backgroundColor: COLORS.primary },
  barText: { fontSize: 11, color: COLORS.subtle },
  barTextActive: { color: COLORS.ink, fontWeight: "500" },
  heading: { fontSize: 18, fontWeight: "500", color: COLORS.ink, marginBottom: 14 },
  subheading: { fontSize: 15, fontWeight: "500", color: COLORS.ink, marginTop: 6, marginBottom: 10 },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginBottom: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeRowActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primarySoft },
  typeBody: { flex: 1 },
  typeName: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  typeDesc: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  multiline: { height: 96, paddingTop: 10, textAlignVertical: "top" },
  hint: { fontSize: 13, color: COLORS.muted, lineHeight: 18 },
  review: { marginTop: 14, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.divider, gap: 4 },
  reviewName: { fontSize: 18, color: COLORS.ink },
  reviewText: { fontSize: 14, color: COLORS.ink, marginTop: 8, lineHeight: 20 },
  error: { fontSize: 13, color: COLORS.danger, marginBottom: 12 },
  submit: {
    marginTop: 16,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
});
