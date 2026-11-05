import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "./AppText";
import ChipGroup from "./ChipGroup";
import Field from "./Field";
import { CATEGORIES, CareerEntry, CareerError, EMPTY_CAREER, sortCareer, validateCareer } from "../career";
import { COLORS, RADIUS } from "../theme";

type Props = { value: CareerEntry[]; onChange: (next: CareerEntry[]) => void };

// Trayectoria: agregar, editar y eliminar experiencias (como "Trayectoria" en Editar perfil de la web).
export default function CareerEditor({ value, onChange }: Props) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState<string | null>(null); // id, o "new"
  const [draft, setDraft] = useState<Omit<CareerEntry, "id">>(EMPTY_CAREER);
  const [error, setError] = useState<CareerError | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const open = (entry?: CareerEntry) => {
    setDraft(entry ? { ...entry } : EMPTY_CAREER);
    setEditing(entry ? entry.id : "new");
    setError(null);
    setToDelete(null);
  };

  const save = () => {
    const err = validateCareer(draft);
    if (err) return setError(err);
    const clean = { ...draft, club: draft.club.trim(), country: draft.country.trim(), league: draft.league.trim(), start: draft.start.trim(), end: draft.end.trim() };
    if (editing === "new") {
      onChange([...value, { ...clean, id: `c${Date.now()}` }]);
    } else {
      onChange(value.map((c) => (c.id === editing ? { ...clean, id: c.id } : c)));
    }
    setEditing(null);
  };

  const range = (c: CareerEntry) => `${c.start} – ${c.end || t("career.present")}`;
  const sub = (c: CareerEntry) => [c.country, c.league, c.category].filter(Boolean).join(" · ");
  const errText: Record<CareerError, string> = {
    club: t("career.errClub"),
    start: t("career.errDate"),
    end: t("career.errDate"),
    order: t("career.errOrder"),
  };

  return (
    <View>
      {value.length === 0 && editing === null && <Text style={styles.empty}>{t("career.empty")}</Text>}

      {sortCareer(value).map((c) => (
        <View key={c.id} style={styles.item}>
          <View style={styles.itemTop}>
            <View style={styles.itemBody}>
              <Text style={styles.club}>{c.club}</Text>
              {!!sub(c) && <Text style={styles.sub}>{sub(c)}</Text>}
              <Text style={styles.sub}>{range(c)}</Text>
            </View>
            <Pressable onPress={() => open(c)} hitSlop={8}>
              <Text style={styles.action}>{t("career.edit")}</Text>
            </Pressable>
            <Pressable onPress={() => setToDelete(toDelete === c.id ? null : c.id)} hitSlop={8}>
              <Text style={[styles.action, { color: COLORS.danger }]}>{t("career.delete")}</Text>
            </Pressable>
          </View>
          {toDelete === c.id && (
            <View style={styles.confirm}>
              <Text style={styles.confirmText}>{t("career.cannotUndo")}</Text>
              <View style={styles.confirmRow}>
                <Pressable onPress={() => setToDelete(null)} style={styles.btnGhost}>
                  <Text style={styles.btnGhostText}>{t("career.cancel")}</Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    onChange(value.filter((x) => x.id !== c.id));
                    setToDelete(null);
                  }}
                  style={styles.btnDanger}
                >
                  <Text style={styles.btnDangerText}>{t("career.delete")}</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      ))}

      {editing !== null ? (
        <View style={styles.form}>
          <Field label={t("career.country")} value={draft.country} onChangeText={(v) => setDraft({ ...draft, country: v })} />
          <Field label={t("career.club")} value={draft.club} onChangeText={(v) => setDraft({ ...draft, club: v })} />
          <Field label={t("career.league")} value={draft.league} onChangeText={(v) => setDraft({ ...draft, league: v })} />
          <View style={styles.dates}>
            <View style={styles.col}>
              <Field
                label={t("career.startDate")}
                value={draft.start}
                placeholder="MM/AAAA"
                keyboardType="numbers-and-punctuation"
                onChangeText={(v) => setDraft({ ...draft, start: v })}
              />
            </View>
            <View style={styles.col}>
              <Field
                label={t("career.endDate")}
                value={draft.end}
                placeholder={t("career.present")}
                keyboardType="numbers-and-punctuation"
                onChangeText={(v) => setDraft({ ...draft, end: v })}
              />
            </View>
          </View>
          <Text style={styles.hint}>{t("career.endHint")}</Text>
          <ChipGroup
            label={t("career.category")}
            options={CATEGORIES.map((c) => ({ value: c, label: c }))}
            value={draft.category}
            onChange={(v) => setDraft({ ...draft, category: v })}
          />
          {error && <Text style={styles.error}>{errText[error]}</Text>}
          <View style={styles.confirmRow}>
            <Pressable onPress={() => setEditing(null)} style={styles.btnGhost}>
              <Text style={styles.btnGhostText}>{t("career.cancel")}</Text>
            </Pressable>
            <Pressable onPress={save} style={styles.btnSolid}>
              <Text style={styles.btnSolidText}>{t("career.saveExperience")}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => open()} style={styles.add}>
          <Text style={styles.addText}>+ {t("career.add")}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { fontSize: 13, color: COLORS.muted, marginBottom: 10 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  itemTop: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  itemBody: { flex: 1 },
  club: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  sub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  action: { fontSize: 13, color: COLORS.primaryDark, fontWeight: "500" },
  confirm: { marginTop: 10, padding: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  confirmText: { fontSize: 13, color: COLORS.muted },
  confirmRow: { flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 10 },
  btnGhost: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  btnGhostText: { fontSize: 13, color: COLORS.ink },
  btnDanger: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.danger },
  btnDangerText: { fontSize: 13, color: COLORS.danger, fontWeight: "500" },
  btnSolid: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
  btnSolidText: { fontSize: 13, color: "#fff", fontWeight: "500" },
  form: { marginTop: 14, padding: 14, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  dates: { flexDirection: "row", gap: 10 },
  col: { flex: 1 },
  hint: { fontSize: 11, color: COLORS.subtle, marginTop: -6, marginBottom: 12 },
  error: { fontSize: 12, color: COLORS.danger, marginBottom: 4 },
  add: { marginTop: 12, paddingVertical: 11, alignItems: "center", borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  addText: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
});
