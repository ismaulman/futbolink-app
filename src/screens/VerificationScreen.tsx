import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { Profile, Role, VerificationStatus } from "../data";
import { COLORS, FONT, RADIUS } from "../theme";

type Props = {
  role: Role;
  name: string;
  profile: Profile;
  status: VerificationStatus;
  onAddPhoto: () => void;
  onEditProfile: () => void;
  onRequest: (message: string) => void;
  onSimulateApproval: () => void;
  onBack: () => void;
};

// Verificación gratuita del perfil: requisitos como en la web + pedido de revisión.
export default function VerificationScreen({
  role,
  name,
  profile,
  status,
  onAddPhoto,
  onEditProfile,
  onRequest,
  onSimulateApproval,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const requirements = [
    { key: "photo", done: profile.hasPhoto, action: onAddPhoto, actionLabel: t("verify.addPhoto") },
    { key: "name", done: name.trim().length >= 2, action: onEditProfile },
    { key: "phone", done: profile.phone.trim() !== "", action: onEditProfile },
    { key: "country", done: profile.nationality.trim() !== "", action: onEditProfile },
    { key: "social", done: profile.social.trim() !== "", action: onEditProfile },
    ...(role === "agency"
      ? [{ key: "agency", done: profile.agencyName.trim() !== "", action: onEditProfile }]
      : []),
  ].map((r) => ({ ...r, actionLabel: r.actionLabel ?? t("verify.complete") }));
  const ready = requirements.every((r) => r.done);

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("verify.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.intro}>{t("verify.intro")}</Text>

        {status === "verified" && (
          <View style={styles.banner}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
            <Text style={styles.bannerText}>{t("verify.verifiedText")}</Text>
          </View>
        )}
        {status === "pending" && (
          <View style={styles.banner}>
            <Ionicons name="time-outline" size={20} color={COLORS.muted} />
            <Text style={styles.bannerText}>{t("verify.pendingText")}</Text>
          </View>
        )}

        <Text style={styles.section}>{t("verify.requirements")}</Text>
        {requirements.map((r) => (
          <View key={r.key} style={styles.row}>
            <Ionicons
              name={r.done ? "checkmark-circle" : "ellipse-outline"}
              size={20}
              color={r.done ? COLORS.primary : COLORS.subtle}
            />
            <Text style={styles.rowText}>{t(`verify.req_${r.key}`)}</Text>
            {!r.done && status === "none" && (
              <Pressable onPress={r.action} hitSlop={8}>
                <Text style={styles.link}>{r.actionLabel}</Text>
              </Pressable>
            )}
          </View>
        ))}

        {status === "none" && (
          <>
            <Text style={styles.section}>{t("verify.message")}</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={t("verify.messagePlaceholder")}
              placeholderTextColor={COLORS.subtle}
              multiline
              style={styles.input}
            />
            <Pressable
              disabled={!ready}
              onPress={() => onRequest(message.trim())}
              style={({ pressed }) => [styles.submit, !ready && styles.disabled, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.submitText}>{t("verify.request")}</Text>
            </Pressable>
            {!ready && <Text style={styles.hint}>{t("verify.missing")}</Text>}
            <Text style={styles.hint}>{t("verify.free")}</Text>
          </>
        )}

        {status === "pending" && (
          <Pressable onPress={onSimulateApproval} style={styles.testLink}>
            <Text style={styles.testText}>{t("verify.simulate")}</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  intro: { fontSize: 14, color: COLORS.muted, lineHeight: 20 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 16,
    padding: 12,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  bannerText: { flex: 1, fontSize: 14, color: COLORS.ink, lineHeight: 20 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 22, marginBottom: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowText: { flex: 1, fontSize: 15, color: COLORS.ink },
  link: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark },
  input: {
    fontFamily: FONT.regular,
    minHeight: 80,
    padding: 12,
    fontSize: 14,
    color: COLORS.ink,
    textAlignVertical: "top",
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  submit: {
    marginTop: 16,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  submitText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  hint: { fontSize: 12, color: COLORS.muted, marginTop: 10, textAlign: "center", lineHeight: 17 },
  testLink: { marginTop: 24, alignItems: "center" },
  testText: { fontSize: 12, color: COLORS.subtle },
});
