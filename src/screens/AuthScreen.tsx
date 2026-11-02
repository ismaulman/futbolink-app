import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import ChipGroup from "../components/ChipGroup";
import Field from "../components/Field";
import Text from "../components/AppText";
import { AGENCY_PUESTOS, ROLE_KEYS, Role, STAFF_PUESTOS, User } from "../data";
import { COLORS, FONT, RADIUS } from "../theme";

type Props = {
  onSubmit: (user: User) => void;
};

type Mode = "login" | "register";
// 0 = tipo de perfil, 1 = puesto, 2 = tus datos, 3 = seguridad (igual que la web)
type Step = 0 | 1 | 2 | 3;

const OTHER = "__other__";
const ROLE_ICONS: Record<Role, keyof typeof Ionicons.glyphMap> = {
  player: "football-outline",
  staff: "clipboard-outline",
  agency: "briefcase-outline",
};

function nameFromEmail(email: string, fallback: string) {
  const base = email.split("@")[0] || fallback;
  return base.charAt(0).toUpperCase() + base.slice(1);
}

const validEmail = (email: string) => email.includes("@") && email.includes(".");

export default function AuthScreen({ onSubmit }: Props) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>(0);
  const [error, setError] = useState("");

  // Registro
  const [role, setRole] = useState<Role>("player");
  const [puesto, setPuesto] = useState("");
  const [otherPuesto, setOtherPuesto] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const goTo = (next: Mode) => {
    setMode(next);
    setStep(0);
    setError("");
  };

  const chooseRole = (next: Role) => {
    setRole(next);
    setPuesto("");
    setError("");
    // Futbolista no tiene puestos: salta directo a "Tus datos".
    setStep(next === "player" ? 2 : 1);
  };

  const back = () => {
    setError("");
    if (step === 2) setStep(role === "player" ? 0 : 1);
    else setStep((step - 1) as Step);
  };

  const next = () => {
    if (step === 1) {
      const chosen = puesto === OTHER ? otherPuesto.trim() : puesto;
      if (!chosen) return setError(t("auth.errPuesto"));
    }
    if (step === 2) {
      if (!firstName.trim() || !lastName.trim() || !nationality.trim() || !gender) {
        return setError(t("auth.errRequired"));
      }
      if (!validEmail(email.trim())) return setError(t("auth.errEmail"));
    }
    setError("");
    setStep((step + 1) as Step);
  };

  const register = () => {
    if (password.length < 8) return setError(t("auth.errPasswordRegister"));
    if (password !== confirm) return setError(t("auth.passwordMismatch"));
    if (!accepted) return setError(t("auth.acceptTerms"));
    onSubmit({
      name: `${firstName.trim()} ${lastName.trim()}`,
      email: email.trim(),
      role,
      phone: phone.trim(),
      nationality: nationality.trim(),
      puesto: role === "player" ? undefined : puesto === OTHER ? otherPuesto.trim() : puesto,
    });
  };

  const login = () => {
    const cleanEmail = email.trim();
    if (!validEmail(cleanEmail)) return setError(t("auth.errEmail"));
    if (password.length < 1) return setError(t("auth.errPasswordLogin"));
    setError("");
    // Versión de prueba: entra como futbolista. Cuando se conecte la
    // plataforma, el rol vendrá de la cuenta.
    onSubmit({ name: nameFromEmail(cleanEmail, t("auth.defaultUser")), email: cleanEmail, role: "player" });
  };

  const passwordInput = (
    value: string,
    onChange: (v: string) => void,
    placeholder: string,
    onSubmitEditing?: () => void,
  ) => (
    <View style={styles.passwordBox}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.subtle}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={onSubmitEditing}
        style={styles.passwordInput}
      />
      <Pressable
        onPress={() => setShowPassword((v) => !v)}
        accessibilityLabel={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
      >
        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.muted} />
      </Pressable>
    </View>
  );

  const googleButton = (
    <>
      <Pressable style={({ pressed }) => [styles.google, pressed && { opacity: 0.85 }]}>
        <Ionicons name="logo-google" size={18} color={COLORS.ink} />
        <Text style={styles.googleText}>{t("auth.google")}</Text>
      </Pressable>
      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>{t("auth.or")}</Text>
        <View style={styles.orLine} />
      </View>
    </>
  );

  const errorText = error !== "" && <Text style={styles.error}>{error}</Text>;

  const linkRow = (question: string, action: string, onPress: () => void) => (
    <Text style={styles.switchText}>
      {question}{" "}
      <Text style={styles.link} onPress={onPress}>
        {action}
      </Text>
    </Text>
  );

  const stepTitles = [t("auth.step1Title"), t("auth.step2Title"), t("auth.step3Title")];
  // El paso activo en la barra: 1 Perfil (pasos 0 y 1), 2 Tus datos, 3 Seguridad.
  const activeBar = step <= 1 ? 0 : step - 1;
  const puestos = role === "agency" ? AGENCY_PUESTOS : STAFF_PUESTOS;

  let body;
  if (mode === "login") {
    body = (
      <>
        <Text style={styles.title}>{t("auth.loginTitle")}</Text>
        <Text style={styles.subtitle}>{t("auth.loginSubtitle")}</Text>
        {googleButton}
        <Field
          label={t("auth.email")}
          value={email}
          onChangeText={setEmail}
          placeholder={t("auth.emailPlaceholder")}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <View style={styles.field}>
          <Text style={styles.label}>{t("auth.password")}</Text>
          {passwordInput(password, setPassword, t("auth.passwordPlaceholderLogin"), login)}
        </View>
        {errorText}
        <Pressable onPress={login} style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}>
          <Text style={styles.submitText}>{t("auth.loginButton")}</Text>
        </Pressable>
        <Text style={styles.forgot}>{t("auth.forgotPassword")}</Text>
        {linkRow(t("auth.noAccount"), t("auth.registerHere"), () => goTo("register"))}
      </>
    );
  } else if (step === 0) {
    body = (
      <>
        <Text style={styles.title}>{t("auth.chooseRoleTitle")}</Text>
        <Text style={styles.subtitle}>{t("auth.chooseRoleSubtitle")}</Text>
        {ROLE_KEYS.map((key) => (
          <Pressable
            key={key}
            onPress={() => chooseRole(key)}
            style={({ pressed }) => [styles.roleCard, pressed && { backgroundColor: COLORS.surface }]}
          >
            <View style={styles.roleIcon}>
              <Ionicons name={ROLE_ICONS[key]} size={20} color={COLORS.primaryDark} />
            </View>
            <View style={styles.roleBody}>
              <Text style={styles.roleLabel}>{t(`role.${key}.label`)}</Text>
              <Text style={styles.roleDescription}>{t(`role.${key}.desc`)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
          </Pressable>
        ))}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>{t("auth.or")}</Text>
          <View style={styles.orLine} />
        </View>
        <Pressable style={({ pressed }) => [styles.google, pressed && { opacity: 0.85 }]}>
          <Ionicons name="logo-google" size={18} color={COLORS.ink} />
          <Text style={styles.googleText}>{t("auth.google")}</Text>
        </Pressable>
        <Text style={styles.footer}>{t("auth.chooseRoleFooter")}</Text>
        {linkRow(t("auth.haveAccount"), t("auth.loginTitle"), () => goTo("login"))}
      </>
    );
  } else {
    body = (
      <>
        <View style={styles.bar}>
          {stepTitles.map((title, i) => (
            <View key={title} style={styles.barItem}>
              <View style={[styles.barLine, i <= activeBar && styles.barLineActive]} />
              <Text style={[styles.barText, i === activeBar && styles.barTextActive]}>{title}</Text>
            </View>
          ))}
        </View>

        {step === 1 && (
          <>
            <Text style={styles.title}>{t("auth.step1Heading")}</Text>
            <View style={styles.list}>
              {puestos.map((id) => {
                const active = puesto === id;
                return (
                  <Pressable key={id} onPress={() => setPuesto(id)} style={styles.option}>
                    <Ionicons
                      name={active ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={active ? COLORS.primaryDark : COLORS.subtle}
                    />
                    <Text style={styles.optionText}>{t(`puesto.${id}`)}</Text>
                  </Pressable>
                );
              })}
              {role === "staff" && (
                <Pressable onPress={() => setPuesto(OTHER)} style={styles.option}>
                  <Ionicons
                    name={puesto === OTHER ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={puesto === OTHER ? COLORS.primaryDark : COLORS.subtle}
                  />
                  <Text style={styles.optionText}>{t("auth.otherRole")}</Text>
                </Pressable>
              )}
            </View>
            {puesto === OTHER && (
              <Field
                label=""
                value={otherPuesto}
                onChangeText={setOtherPuesto}
                placeholder={t("auth.otherRolePlaceholder")}
              />
            )}
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.title}>{t("auth.step2Title")}</Text>
            <Field label={t("auth.nameLabel")} value={firstName} onChangeText={setFirstName} />
            <Field label={t("auth.lastNameLabel")} value={lastName} onChangeText={setLastName} />
            <Field
              label={t("auth.email")}
              value={email}
              onChangeText={setEmail}
              placeholder={t("auth.emailPlaceholder")}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <Field label={t("auth.phoneLabel")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <Field label={t("auth.nationalityLabel")} value={nationality} onChangeText={setNationality} />
            <ChipGroup
              label={t("auth.genderLabel")}
              value={gender}
              onChange={setGender}
              options={[
                { value: "male", label: t("auth.male") },
                { value: "female", label: t("auth.female") },
                { value: "other", label: t("auth.genderOther") },
              ]}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.title}>{t("auth.step3Heading")}</Text>
            <View style={styles.field}>
              <Text style={styles.label}>{t("auth.password")}</Text>
              {passwordInput(password, setPassword, t("auth.passwordPlaceholderRegister"))}
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>{t("auth.confirmPasswordLabel")}</Text>
              {passwordInput(confirm, setConfirm, t("auth.passwordPlaceholderRegister"))}
            </View>
            <Field
              label={t("auth.usernameLabel")}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helper}>{t("auth.usernameHelper")}</Text>
            <Pressable onPress={() => setAccepted((v) => !v)} style={styles.terms}>
              <Ionicons
                name={accepted ? "checkbox" : "square-outline"}
                size={22}
                color={accepted ? COLORS.primaryDark : COLORS.subtle}
              />
              <Text style={styles.termsText}>
                {t("auth.acceptTermsPrefix")} <Text style={styles.link}>{t("auth.termsLink")}</Text>
              </Text>
            </Pressable>
          </>
        )}

        {errorText}
        <Pressable
          onPress={step === 3 ? register : next}
          style={({ pressed }) => [styles.submit, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.submitText}>{step === 3 ? t("auth.createAccount") : t("auth.continue")}</Text>
        </Pressable>
        <Pressable onPress={step === 1 ? () => setStep(0) : back} hitSlop={8}>
          <Text style={styles.forgot}>{step === 1 ? t("auth.changeProfileType") : t("auth.back")}</Text>
        </Pressable>
      </>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>FutboLink</Text>
        <Text style={styles.tagline}>{t("app.tagline")}</Text>
        <View style={styles.card}>{body}</View>
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
  logo: { fontSize: 32, fontWeight: "500", color: COLORS.brand, textAlign: "center" },
  tagline: { fontSize: 14, color: COLORS.muted, textAlign: "center", marginTop: 4, marginBottom: 24 },
  card: {
    padding: 18,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  title: { fontSize: 20, fontWeight: "500", color: COLORS.ink, marginBottom: 4 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginBottom: 18, lineHeight: 18 },
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "500", color: COLORS.ink, marginBottom: 6 },
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  passwordInput: {
    fontFamily: FONT.regular,
    flex: 1,
    height: 44,
    fontSize: 14,
    color: COLORS.ink,
  },
  roleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    marginTop: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  roleBody: { flex: 1 },
  roleLabel: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  roleDescription: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  google: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 44,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  googleText: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  orRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 14 },
  orLine: { flex: 1, height: 1, backgroundColor: COLORS.divider },
  orText: { fontSize: 12, color: COLORS.subtle },
  footer: { fontSize: 12, color: COLORS.muted, textAlign: "center", marginTop: 14 },
  bar: { flexDirection: "row", gap: 6, marginBottom: 18 },
  barItem: { flex: 1 },
  barLine: { height: 3, borderRadius: 2, backgroundColor: COLORS.divider, marginBottom: 6 },
  barLineActive: { backgroundColor: COLORS.primary },
  barText: { fontSize: 11, color: COLORS.subtle },
  barTextActive: { color: COLORS.ink, fontWeight: "500" },
  list: { marginTop: 10, marginBottom: 6 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  optionText: { fontSize: 14, color: COLORS.ink },
  helper: { fontSize: 12, color: COLORS.muted, lineHeight: 17, marginTop: -6, marginBottom: 14 },
  terms: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  termsText: { flex: 1, fontSize: 13, color: COLORS.ink },
  link: { color: COLORS.primaryDark, fontWeight: "500" },
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
  switchText: { fontSize: 13, color: COLORS.muted, textAlign: "center", marginTop: 14 },
  note: { fontSize: 11, color: COLORS.muted, textAlign: "center", marginTop: 18, lineHeight: 16 },
});
