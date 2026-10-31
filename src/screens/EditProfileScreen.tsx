import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import ChipGroup from "../components/ChipGroup";
import Text from "../components/AppText";
import Field from "../components/Field";
import ScreenHeader from "../components/ScreenHeader";
import { POSITIONS, Profile, Role } from "../data";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Props = {
  name: string;
  role: Role;
  profile: Profile;
  onSave: (name: string, profile: Profile) => void;
  onBack: () => void;
};

const FEET = ["Derecho", "Izquierdo", "Ambos"];
const onlyDigits = (value: string) => value.replace(/[^0-9]/g, "").slice(0, 3);

export default function EditProfileScreen({ name, role, profile, onSave, onBack }: Props) {
  const { t } = useTranslation();
  const [draftName, setDraftName] = useState(name);
  const [draft, setDraft] = useState<Profile>(profile);
  const [error, setError] = useState(false);
  const isPlayer = role === "player";
  const positions = POSITIONS.filter((p) => p !== "Todas");

  const update = (patch: Partial<Profile>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    if (draftName.trim().length < 2) {
      setError(true);
      return;
    }
    onSave(draftName.trim(), draft);
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("edit.title")} onBack={onBack} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>{t("edit.personal")}</Text>
        <Field
          label={t("edit.name")}
          value={draftName}
          onChangeText={(v) => {
            setDraftName(v);
            setError(false);
          }}
        />
        {error && <Text style={styles.error}>{t("auth.errName")}</Text>}
        <Field
          label={t("edit.nationality")}
          value={draft.nationality}
          onChangeText={(v) => update({ nationality: v })}
        />
        <Field
          label={t("edit.location")}
          value={draft.location}
          onChangeText={(v) => update({ location: v })}
        />

        {isPlayer && (
          <>
            <Text style={[styles.section, styles.sectionGap]}>{t("edit.sports")}</Text>
            <ChipGroup
              label={t("edit.primaryPosition")}
              options={positions.map((p) => ({ value: p, label: tc(p) }))}
              value={draft.position}
              onChange={(v) => update({ position: v })}
            />
            <ChipGroup
              label={t("edit.secondaryPosition")}
              options={[
                { value: "", label: t("edit.none") },
                ...positions.map((p) => ({ value: p, label: tc(p) })),
              ]}
              value={draft.secondaryPosition}
              onChange={(v) => update({ secondaryPosition: v })}
            />
            <ChipGroup
              label={t("profile.foot")}
              options={FEET.map((f) => ({ value: f, label: tc(f) }))}
              value={draft.foot}
              onChange={(v) => update({ foot: v })}
            />
            <View style={styles.twoCols}>
              <View style={styles.col}>
                <Field
                  label={t("edit.height")}
                  value={draft.heightCm}
                  keyboardType="numeric"
                  onChangeText={(v) => update({ heightCm: onlyDigits(v) })}
                />
              </View>
              <View style={styles.col}>
                <Field
                  label={t("edit.weight")}
                  value={draft.weightKg}
                  keyboardType="numeric"
                  onChangeText={(v) => update({ weightKg: onlyDigits(v) })}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={save}
          style={({ pressed }) => [styles.save, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.saveText}>{t("common.save")}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 24 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginBottom: 12 },
  sectionGap: { marginTop: 12 },
  error: { fontSize: 13, color: COLORS.danger, marginTop: -8, marginBottom: 12 },
  twoCols: { flexDirection: "row", gap: 12 },
  col: { flex: 1 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  save: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
});
