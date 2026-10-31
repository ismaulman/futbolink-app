import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import Text from "../components/AppText";
import { ROLE_KEYS, Role, User } from "../data";
import { COLORS, RADIUS, FONT } from "../theme";
import { useTranslation } from "react-i18next";

type Mode = "login" | "register";

type Props = {
  onSubmit: (user: User) => void;
};

function nameFromEmail(email: string, fallback: string) {
  const base = email.split("@")[0] || fallback;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function AuthScreen({ onSubmit }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("player");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const changeMode = (next: Mode) => {
    setMode(next);
    setError("");
  };

  const submit = () => {
    const cleanEmail = email.trim();
    if (isRegister && name.trim().length < 2) {
      setError(t("auth.errName"));
      return;
    }
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError(t("auth.errEmail"));
      return;
    }
    if (password.length < (isRegister ? 8 : 1)) {
      setError(
        isRegister
          ? t("auth.errPasswordRegister")
          : t("auth.errPasswordLogin"),
      );
      return;
    }
    setError("");
    onSubmit({
      name: isRegister ? name.trim() : nameFromEmail(cleanEmail, t("auth.defaultUser")),
      email: cleanEmail,
      role,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>FutboLink</Text>
        <Text style={styles.tagline}>{t("app.tagline")}</Text>

        <View style={styles.card}>
          <View style={styles.segment}>
            <Pressable
              onPress={() => changeMode("login")}
              style={[styles.segmentItem, !isRegister && styles.segmentActive]}
            >
              <Text
                style={[styles.segmentText, !isRegister && styles.segmentTextActive]}
              >
                {t("auth.login")}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => changeMode("register")}
              style={[styles.segmentItem, isRegister && styles.segmentActive]}
            >
              <Text
                style={[styles.segmentText, isRegister && styles.segmentTextActive]}
              >
                {t("auth.register")}
              </Text>
            </Pressable>
          </View>

          {isRegister && (
            <View style={styles.field}>
              <Text style={styles.label}>{t("auth.fullName")}</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t("auth.namePlaceholder")}
                placeholderTextColor={COLORS.subtle}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>{t("auth.email")}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.emailPlaceholder")}
              placeholderTextColor={COLORS.subtle}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{t("auth.password")}</Text>
            <View style={styles.passwordBox}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={
                  isRegister
                    ? t("auth.passwordPlaceholderRegister")
                    : t("auth.passwordPlaceholderLogin")
                }
                placeholderTextColor={COLORS.subtle}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={submit}
                style={styles.passwordInput}
              />
              <Pressable onPress={() => setShowPassword((current) => !current)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>
          </View>

          {isRegister && (
            <View style={styles.field}>
              <Text style={styles.label}>{t("auth.howUse")}</Text>
              {ROLE_KEYS.map((key) => {
                const active = key === role;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setRole(key)}
                    style={[styles.roleCard, active && styles.roleCardActive]}
                  >
                    <Ionicons
                      name={active ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={active ? COLORS.primaryDark : COLORS.subtle}
                    />
                    <View style={styles.roleBody}>
                      <Text style={styles.roleLabel}>{t(`role.${key}.label`)}</Text>
                      <Text style={styles.roleDescription}>{t(`role.${key}.desc`)}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          {error !== "" && <Text style={styles.error}>{error}</Text>}

          <Pressable
            onPress={submit}
            style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.submitText}>
              {isRegister ? t("auth.register") : t("auth.login")}
            </Text>
          </Pressable>

          {!isRegister && (
            <Text style={styles.forgot}>{t("auth.forgot")}</Text>
          )}
        </View>

        <Text style={styles.note}>{t("auth.testNote")}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  logo: {
    fontSize: 32,
    fontWeight: "500",
    color: COLORS.brand,
    textAlign: "center",
  },
  tagline: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },
  card: {
    padding: 18,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  segment: {
    flexDirection: "row",
    padding: 3,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentActive: { backgroundColor: COLORS.white },
  segmentText: { fontSize: 13, fontWeight: "500", color: COLORS.muted },
  segmentTextActive: { color: COLORS.ink },
  field: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.ink,
    marginBottom: 6,
  },
  input: {
    fontFamily: FONT.regular,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.ink,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  passwordInput: {
    fontFamily: FONT.regular,
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.ink,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    marginBottom: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  roleCardActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySoft,
  },
  roleBody: { flex: 1 },
  roleLabel: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  roleDescription: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  error: { fontSize: 13, color: COLORS.danger, marginBottom: 12 },
  submit: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  submitText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  forgot: {
    fontSize: 13,
    color: COLORS.primaryDark,
    textAlign: "center",
    marginTop: 14,
    fontWeight: "500",
  },
  note: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 18,
    lineHeight: 16,
  },
});
