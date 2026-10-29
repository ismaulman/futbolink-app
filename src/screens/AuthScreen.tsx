import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { ROLES, Role, User } from "../data";
import { COLORS, RADIUS } from "../theme";

type Mode = "login" | "register";

type Props = {
  onSubmit: (user: User) => void;
};

function nameFromEmail(email: string) {
  const base = email.split("@")[0] || "Usuario";
  return base.charAt(0).toUpperCase() + base.slice(1);
}

export default function AuthScreen({ onSubmit }: Props) {
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
      setError("Escribí tu nombre completo.");
      return;
    }
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Ingresá un email válido.");
      return;
    }
    if (password.length < (isRegister ? 6 : 1)) {
      setError(
        isRegister
          ? "La contraseña debe tener al menos 6 caracteres."
          : "Ingresá tu contraseña.",
      );
      return;
    }
    setError("");
    onSubmit({
      name: isRegister ? name.trim() : nameFromEmail(cleanEmail),
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
        <Text style={styles.tagline}>Conectamos talento con oportunidades</Text>

        <View style={styles.card}>
          <View style={styles.segment}>
            <Pressable
              onPress={() => changeMode("login")}
              style={[styles.segmentItem, !isRegister && styles.segmentActive]}
            >
              <Text
                style={[styles.segmentText, !isRegister && styles.segmentTextActive]}
              >
                Ingresar
              </Text>
            </Pressable>
            <Pressable
              onPress={() => changeMode("register")}
              style={[styles.segmentItem, isRegister && styles.segmentActive]}
            >
              <Text
                style={[styles.segmentText, isRegister && styles.segmentTextActive]}
              >
                Crear cuenta
              </Text>
            </Pressable>
          </View>

          {isRegister && (
            <View style={styles.field}>
              <Text style={styles.label}>Nombre completo</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                placeholderTextColor={COLORS.subtle}
                style={styles.input}
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              placeholderTextColor={COLORS.subtle}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordBox}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={isRegister ? "Mínimo 6 caracteres" : "Tu contraseña"}
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
              <Text style={styles.label}>¿Cómo vas a usar FutboLink?</Text>
              {ROLES.map((item) => {
                const active = item.key === role;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => setRole(item.key)}
                    style={[styles.roleCard, active && styles.roleCardActive]}
                  >
                    <Ionicons
                      name={active ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={active ? COLORS.green : COLORS.subtle}
                    />
                    <View style={styles.roleBody}>
                      <Text style={styles.roleLabel}>{item.label}</Text>
                      <Text style={styles.roleDescription}>{item.description}</Text>
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
              {isRegister ? "Crear cuenta" : "Ingresar"}
            </Text>
          </Pressable>

          {!isRegister && (
            <Text style={styles.forgot}>¿Olvidaste tu contraseña?</Text>
          )}
        </View>

        <Text style={styles.note}>
          Versión de prueba: por ahora cualquier email y contraseña válidos
          entran, y los datos no se guardan.
        </Text>
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
    fontWeight: "800",
    color: COLORS.green,
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
    backgroundColor: "#f3f4f6",
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 6,
  },
  segmentActive: { backgroundColor: COLORS.white },
  segmentText: { fontSize: 13, fontWeight: "600", color: COLORS.muted },
  segmentTextActive: { color: COLORS.greenDark },
  field: { marginBottom: 14 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.text,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
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
    flex: 1,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.text,
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
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenLight,
  },
  roleBody: { flex: 1 },
  roleLabel: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  roleDescription: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  error: { fontSize: 13, color: "#b91c1c", marginBottom: 12 },
  submit: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: { fontSize: 15, fontWeight: "700", color: COLORS.white },
  forgot: {
    fontSize: 13,
    color: COLORS.green,
    textAlign: "center",
    marginTop: 14,
    fontWeight: "600",
  },
  note: {
    fontSize: 11,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 18,
    lineHeight: 16,
  },
});
