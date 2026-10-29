import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MY_PROFILE, ROLES, User } from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  user: User;
  appliedCount: number;
  onLogout: () => void;
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function PerfilScreen({ user, appliedCount, onLogout }: Props) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const roleLabel = ROLES.find((item) => item.key === user.role)?.label ?? "";
  const isPlayer = user.role === "player";

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Perfil</Text>

      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.subtitle}>
          {roleLabel} · {user.email}
        </Text>

        <View style={styles.unverified}>
          <Ionicons name="shield-outline" size={14} color={COLORS.muted} />
          <Text style={styles.unverifiedText}>Perfil sin verificar</Text>
        </View>

        <View style={styles.statsRow}>
          <Stat value={String(MY_PROFILE.views)} label="Vistas" />
          <Stat value={String(MY_PROFILE.videoPlays)} label="Reproducciones" />
          <Stat value={String(appliedCount)} label="Postulaciones" />
        </View>
      </View>

      {isPlayer ? (
        <>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.card}>
            <InfoRow label="Posición" value={MY_PROFILE.position} />
            <InfoRow label="Altura" value={MY_PROFILE.height} />
            <InfoRow label="Pie hábil" value={MY_PROFILE.foot} />
            <InfoRow label="Club actual" value={MY_PROFILE.club} />
          </View>

          <Text style={styles.sectionTitle}>Trayectoria</Text>
          <View style={styles.card}>
            {MY_PROFILE.career.map((item, index) => (
              <View
                key={item.year}
                style={[
                  styles.careerRow,
                  index === MY_PROFILE.career.length - 1 && styles.careerRowLast,
                ]}
              >
                <Text style={styles.careerYear}>{item.year}</Text>
                <Text style={styles.careerClub}>{item.club}</Text>
                <Text style={styles.careerDetail}>{item.detail}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={[styles.card, styles.emptyCard]}>
          <Text style={styles.emptyTitle}>Completá tu perfil</Text>
          <Text style={styles.emptyText}>
            Acá vas a poder cargar tu experiencia y los datos de tu{" "}
            {user.role === "agency" ? "agencia" : "trabajo"}.
          </Text>
        </View>
      )}

      <Pressable
        onPress={onLogout}
        style={({ pressed }) => [styles.logout, pressed && { opacity: 0.8 }]}
      >
        <Ionicons name="log-out-outline" size={18} color={COLORS.muted} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 24 },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.greenDark,
    marginBottom: 14,
  },
  headerCard: {
    alignItems: "center",
    padding: 18,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: COLORS.green },
  name: { fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 10 },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  unverified: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unverifiedText: { fontSize: 12, color: COLORS.muted },
  statsRow: {
    flexDirection: "row",
    alignSelf: "stretch",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: COLORS.green },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 2 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.greenDark,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  emptyCard: { marginTop: 20 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  emptyText: { fontSize: 13, color: COLORS.muted, marginTop: 4, lineHeight: 19 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: { fontSize: 13, color: COLORS.muted },
  infoValue: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  careerRow: {
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  careerRowLast: { paddingBottom: 0, marginBottom: 0, borderBottomWidth: 0 },
  careerYear: { fontSize: 11, color: COLORS.muted },
  careerClub: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginTop: 2 },
  careerDetail: { fontSize: 12, color: COLORS.muted, marginTop: 1 },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  logoutText: { fontSize: 14, fontWeight: "600", color: COLORS.muted },
});
