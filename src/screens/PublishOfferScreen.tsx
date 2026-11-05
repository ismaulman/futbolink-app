import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ChipGroup from "../components/ChipGroup";
import Text from "../components/AppText";
import Field from "../components/Field";
import ScreenHeader from "../components/ScreenHeader";
import {
  CATEGORIES,
  CURRENCIES,
  EXTRAS,
  OfferType,
  POSITIONS,
  SPORT_GENRES,
  STAFF_ROLES,
} from "../data";
import { tc } from "../i18n";
import { EMPTY_DRAFT, OfferDraft } from "../offerDraft";
import { COLORS, RADIUS } from "../theme";

export type { OfferDraft };

type Props = {
  onPublish: (draft: OfferDraft) => void;
  onBack: () => void;
  initial?: OfferDraft; // editar una oferta existente
  reusable?: { id: string; title: string; draft: OfferDraft }[]; // ofertas propias para duplicar
};

const digits = (v: string) => v.replace(/[^0-9]/g, "").slice(0, 2);

export default function PublishOfferScreen({ onPublish, onBack, initial, reusable = [] }: Props) {
  const { t } = useTranslation();
  const editing = !!initial;
  const [draft, setDraft] = useState<OfferDraft>(initial ?? EMPTY_DRAFT);
  const [pickOpen, setPickOpen] = useState(false);  const [errors, setErrors] = useState<{ position?: boolean; country?: boolean }>({});

  const update = (patch: Partial<OfferDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const positionOptions = (draft.type === "player"
    ? POSITIONS.filter((p) => p !== "Todas")
    : STAFF_ROLES
  ).map((p) => ({ value: p, label: tc(p) }));

  const toggleExtra = (extra: string) =>
    update({
      extras: draft.extras.includes(extra)
        ? draft.extras.filter((e) => e !== extra)
        : [...draft.extras, extra],
    });

  const submit = () => {
    const next = { position: draft.position === "", country: draft.country.trim() === "" };
    setErrors(next);
    if (next.position || next.country) return;
    onPublish(draft);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={editing ? t("publish.editTitle") : t("publish.title")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!editing && (
          <View style={styles.reuse}>
            <Pressable onPress={() => setPickOpen((v) => !v)}>
              <Text style={styles.reuseTitle}>{t("publish.duplicateTitle")}</Text>
              <Text style={styles.reuseDesc}>{t("publish.duplicateDesc")}</Text>
            </Pressable>
            {pickOpen &&
              (reusable.length === 0 ? (
                <Text style={styles.reuseDesc}>{t("publish.duplicateEmpty")}</Text>
              ) : (
                reusable.map((r) => (
                  <View key={r.id} style={styles.reuseRow}>
                    <Text style={styles.reuseName} numberOfLines={1}>
                      {r.title}
                    </Text>
                    <Pressable
                      onPress={() => {
                        setDraft(r.draft);
                        setPickOpen(false);
                      }}
                      hitSlop={8}
                    >
                      <Text style={styles.reuseUse}>{t("publish.duplicateUse")}</Text>
                    </Pressable>
                  </View>
                ))
              ))}
          </View>
        )}
        <ChipGroup
          label=""
          options={[
            { value: "player", label: t("publish.forPlayer") },
            { value: "staff", label: t("publish.forStaff") },
          ]}
          value={draft.type}
          onChange={(v) => update({ type: v as OfferType, position: "" })}
        />
        <ChipGroup
          label={t("publish.position")}
          options={positionOptions}
          value={draft.position}
          onChange={(v) => update({ position: v })}
        />
        {errors.position && <Text style={styles.error}>{t("publish.errPosition")}</Text>}

        <Field
          label={t("publish.offerTitle")}
          value={draft.title}
          onChangeText={(v) => update({ title: v })}
        />
        <View style={styles.twoCols}>
          <View style={styles.col}>
            <Field
              label={t("publish.country")}
              value={draft.country}
              onChangeText={(v) => update({ country: v })}
            />
          </View>
          <View style={styles.col}>
            <Field
              label={t("publish.city")}
              value={draft.city}
              onChangeText={(v) => update({ city: v })}
            />
          </View>
        </View>
        {errors.country && <Text style={styles.error}>{t("publish.errCountry")}</Text>}

        <ChipGroup
          label={t("offer.category")}
          options={CATEGORIES.map((c) => ({ value: c, label: tc(c) }))}
          value={draft.category}
          onChange={(v) => update({ category: v })}
        />
        <ChipGroup
          label={t("publish.gender")}
          options={SPORT_GENRES.map((g) => ({ value: g, label: tc(g) }))}
          value={draft.genre}
          onChange={(v) => update({ genre: v })}
        />

        <View style={styles.twoCols}>
          <View style={styles.col}>
            <Field
              label={t("publish.salary")}
              value={draft.salary}
              keyboardType="numeric"
              onChangeText={(v) => update({ salary: v.replace(/[^0-9]/g, "") })}
            />
          </View>
          <View style={styles.col}>
            <ChipGroup
              label={t("publish.currency")}
              options={CURRENCIES.map((c) => ({ value: c, label: c }))}
              value={draft.currency}
              onChange={(v) => update({ currency: v })}
            />
          </View>
        </View>
        <Field
          label={t("publish.contract")}
          value={draft.contract}
          onChangeText={(v) => update({ contract: v })}
        />
        <View style={styles.twoCols}>
          <View style={styles.col}>
            <Field
              label={t("publish.minAge")}
              value={draft.minAge}
              keyboardType="numeric"
              onChangeText={(v) => update({ minAge: digits(v) })}
            />
          </View>
          <View style={styles.col}>
            <Field
              label={t("publish.maxAge")}
              value={draft.maxAge}
              keyboardType="numeric"
              onChangeText={(v) => update({ maxAge: digits(v) })}
            />
          </View>
        </View>

        <Field
          label={t("publish.description")}
          value={draft.description}
          onChangeText={(v) => update({ description: v })}
          multiline
          style={styles.multiline}
        />

        <Text style={styles.label}>{t("publish.benefits")}</Text>
        <View style={styles.chips}>
          {EXTRAS.map((extra) => {
            const active = draft.extras.includes(extra);
            return (
              <Pressable
                key={extra}
                onPress={() => toggleExtra(extra)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{tc(extra)}</Text>
              </Pressable>
            );
          })}
        </View>

        {!editing && <Text style={styles.hint}>{t("publish.hint")}</Text>}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={submit}
          style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.submitText}>{editing ? t("publish.saveChanges") : t("publish.submit")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  reuse: { padding: 14, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border, marginBottom: 16 },
  reuseTitle: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  reuseDesc: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  reuseRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 12, marginTop: 10, borderTopWidth: 1, borderTopColor: COLORS.divider },
  reuseName: { flex: 1, fontSize: 14, color: COLORS.ink },
  reuseUse: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark },
  content: { padding: 16, paddingBottom: 24 },
  twoCols: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  error: { fontSize: 13, color: COLORS.danger, marginBottom: 12 },
  multiline: { height: 110, paddingTop: 12, textAlignVertical: "top" },
  label: { fontSize: 12, fontWeight: "500", color: COLORS.ink, marginBottom: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primaryBorder },
  chipText: { fontSize: 13, color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark },
  hint: { fontSize: 12, color: COLORS.muted, marginTop: 16, lineHeight: 18 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  submit: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
});
