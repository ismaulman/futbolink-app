import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { NotificationPrefs, VerificationStatus } from "../data";
import i18n, { LANGUAGES } from "../i18n";
import { COLORS, RADIUS } from "../theme";

type Props = {
  email: string;
  prefs: NotificationPrefs;
  onPrefsChange: (prefs: NotificationPrefs) => void;
  verification: VerificationStatus;
  onOpenPlan: () => void;
  onOpenVerification: () => void;
  onLogout: () => void;
  onBack: () => void;
};

function ToggleRow({
  title,
  description,
  value,
  onChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor={COLORS.white}
      />
    </View>
  );
}

function LinkRow({
  icon,
  label,
  detail,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  detail?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}>
      <Ionicons name={icon} size={20} color={COLORS.ink} />
      <Text style={styles.linkText}>{label}</Text>
      {detail ? <Text style={styles.rowDescription}>{detail}</Text> : null}
      <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
    </Pressable>
  );
}

export default function SettingsScreen({
  email,
  prefs,
  onPrefsChange,
  verification,
  onOpenPlan,
  onOpenVerification,
  onLogout,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("settings.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>{t("settings.language")}</Text>
        <View style={styles.langRow}>
          {LANGUAGES.map((lang) => {
            const active = i18n.language === lang.code;
            return (
              <Pressable
                key={lang.code}
                onPress={() => i18n.changeLanguage(lang.code)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {lang.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.section}>{t("settings.notifications")}</Text>
        <ToggleRow
          title={t("settings.notifyJobs")}
          description={t("settings.notifyJobsDesc")}
          value={prefs.emailNotifyJobMatches}
          onChange={(v) => onPrefsChange({ ...prefs, emailNotifyJobMatches: v })}
        />
        <ToggleRow
          title={t("settings.notifyAlerts")}
          description={t("settings.notifyAlertsDesc")}
          value={prefs.emailNotifyTalentAlerts}
          onChange={(v) => onPrefsChange({ ...prefs, emailNotifyTalentAlerts: v })}
        />

        <Text style={styles.section}>{t("settings.account")}</Text>
        <View style={styles.accountEmail}>
          <Text style={styles.rowDescription}>{t("auth.email")}</Text>
          <Text style={styles.rowTitle}>{email}</Text>
        </View>
        <LinkRow icon="ribbon-outline" label={t("plan.title")} onPress={onOpenPlan} />
        <LinkRow
          icon="shield-checkmark-outline"
          label={t("verify.title")}
          detail={t(`verify.status_${verification}`)}
          onPress={onOpenVerification}
        />
        <LinkRow icon="help-circle-outline" label={t("settings.help")} />
        <LinkRow icon="document-text-outline" label={t("settings.terms")} />

        <Pressable
          onPress={onLogout}
          style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="log-out-outline" size={20} color={COLORS.ink} />
          <Text style={styles.linkText}>{t("profile.logout")}</Text>
        </Pressable>

        {!confirmDelete ? (
          <Pressable onPress={() => setConfirmDelete(true)} style={styles.deleteLink}>
            <Text style={styles.deleteText}>{t("settings.deleteAccount")}</Text>
          </Pressable>
        ) : (
          <View style={styles.deleteBox}>
            <Text style={styles.deleteWarning}>{t("settings.deleteWarning")}</Text>
            <View style={styles.deleteActions}>
              <Pressable onPress={() => setConfirmDelete(false)} style={styles.cancel}>
                <Text style={styles.cancelText}>{t("common.cancel")}</Text>
              </Pressable>
              <Pressable onPress={onLogout} style={styles.confirm}>
                <Text style={styles.confirmText}>{t("settings.deleteConfirm")}</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 20, marginBottom: 10 },
  langRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primaryBorder },
  chipText: { fontSize: 13, color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  toggleText: { flex: 1 },
  rowTitle: { fontSize: 14, color: COLORS.ink },
  rowDescription: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  accountEmail: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  linkText: { flex: 1, fontSize: 14, color: COLORS.ink },
  deleteLink: { paddingVertical: 16 },
  deleteText: { fontSize: 14, color: COLORS.danger },
  deleteBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  deleteWarning: { fontSize: 13, color: COLORS.ink, lineHeight: 19 },
  deleteActions: { flexDirection: "row", gap: 8, marginTop: 12 },
  cancel: {
    flex: 1,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: { fontSize: 13, color: COLORS.ink },
  confirm: {
    flex: 2,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: { fontSize: 13, color: COLORS.white },
});
