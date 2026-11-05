import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "./AppText";
import ChipGroup from "./ChipGroup";
import { JobAlert, MAX_CUSTOM_ALERTS, newThisWeek } from "../forYou";
import { Offer } from "../data";
import { tc } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Props = {
  alerts: JobAlert[];
  offers: Offer[];
  positionOptions: string[];
  countryOptions: string[];
  defaultCountry: string;
  onChange: (alerts: JobAlert[]) => void;
};

// Mis alertas: la web avisa cuando sale una oferta de la posición (y país) elegidos.
export default function AlertsCard({ alerts, offers, positionOptions, countryOptions, defaultCountry, onChange }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(positionOptions[0] ?? "");
  const [country, setCountry] = useState(defaultCountry);
  const customCount = alerts.filter((a) => a.kind === "CUSTOM").length;
  const canCreate = customCount < MAX_CUSTOM_ALERTS;

  const create = () => {
    if (!position) return;
    onChange([...alerts, { id: `a${Date.now()}`, kind: "CUSTOM", position, country: country || null }]);
    setOpen(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>{t("forYou.myAlerts")}</Text>
        <Text style={styles.count}>{t("forYou.alertsActive", { n: alerts.length })}</Text>
      </View>
      {alerts.length === 0 && <Text style={styles.empty}>{t("forYou.alertsEmpty")}</Text>}
      {alerts.map((a) => {
        const n = newThisWeek(a, offers);
        return (
          <View key={a.id} style={styles.row}>
            <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle} numberOfLines={1}>
                {[tc(a.position), a.country ? tc(a.country) : t("forYou.anyCountry")].join(" · ")}
              </Text>
              <Text style={styles.rowSub}>
                {n > 0 ? t("forYou.alertNew", { n }) : t("forYou.alertNone")}
                {a.kind === "AUTO" ? ` · ${t("forYou.alertAuto")}` : ""}
              </Text>
            </View>
            {a.kind === "CUSTOM" && (
              <Pressable onPress={() => onChange(alerts.filter((x) => x.id !== a.id))} hitSlop={8} accessibilityLabel={t("forYou.alertDelete")}>
                <Ionicons name="trash-outline" size={18} color={COLORS.muted} />
              </Pressable>
            )}
          </View>
        );
      })}

      {open ? (
        <View style={styles.form}>
          <ChipGroup
            label={t("forYou.position")}
            options={positionOptions.map((p) => ({ value: p, label: tc(p) }))}
            value={position}
            onChange={setPosition}
          />
          <ChipGroup
            label={t("forYou.alertCountry")}
            options={[{ value: "", label: t("forYou.anyCountry") }, ...countryOptions.map((c) => ({ value: c, label: tc(c) }))]}
            value={country}
            onChange={setCountry}
          />
          <View style={styles.actions}>
            <Pressable onPress={() => setOpen(false)} style={styles.ghost}>
              <Text style={styles.ghostText}>{t("forYou.cancel")}</Text>
            </Pressable>
            <Pressable onPress={create} style={styles.solid}>
              <Text style={styles.solidText}>{t("forYou.alertCreate")}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => canCreate && setOpen(true)} disabled={!canCreate} style={[styles.add, !canCreate && { opacity: 0.5 }]}>
          <Text style={styles.addText}>{canCreate ? `+ ${t("forYou.createAlert")}` : t("forYou.alertsMax")}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, marginBottom: 12 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 },
  title: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  count: { fontSize: 12, color: COLORS.muted },
  empty: { fontSize: 13, color: COLORS.muted, marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: COLORS.divider },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  rowSub: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  form: { marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.divider },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  ghost: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  ghostText: { fontSize: 13, color: COLORS.ink },
  solid: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: RADIUS.md, backgroundColor: COLORS.primary },
  solidText: { fontSize: 13, color: "#fff", fontWeight: "500" },
  add: { marginTop: 8, paddingVertical: 10, alignItems: "center", borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  addText: { fontSize: 13, fontWeight: "500", color: COLORS.ink },
});
