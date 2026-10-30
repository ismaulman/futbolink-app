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

// Perfil estilo Instagram/LinkedIn: avatar + números arriba, datos en listas
// planas con divisores finos, sin cajas ni negritas pesadas.
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
      <View style={styles.topRow}>
        <Text style={styles.username}>{user.name}</Text>
        <Pressable onPress={onLogout} hitSlop={10} accessibilityLabel="Cerrar sesión">
          <Ionicons name="log-out-outline" size={24} color={COLORS.ink} />
        </Pressable>
      </View>

      <View style={styles.headerRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.statsRow}>
          <Stat value={String(MY_PROFILE.views)} label="Vistas" />
          <Stat value={String(MY_PROFILE.videoPlays)} label="Videos" />
          <Stat value={String(appliedCount)} label="Postulaciones" />
        </View>
      </View>

      <View style={styles.bio}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>
          {roleLabel}
          {isPlayer ? ` · ${MY_PROFILE.position}` : ""}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
          <Text style={styles.actionText}>Editar perfil</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
          <Ionicons name="shield-checkmark-outline" size={15} color={COLORS.ink} />
          <Text style={styles.actionText}>Verificar</Text>
        </Pressable>
      </View>

      {isPlayer ? (
        <>
          <Text style={styles.sectionTitle}>Información</Text>
          <View style={styles.list}>
            <InfoRow label="Posición" value={MY_PROFILE.position} />
            <InfoRow label="Altura" value={MY_PROFILE.height} />
            <InfoRow label="Pie hábil" value={MY_PROFILE.foot} />
            <InfoRow label="Club actual" value={MY_PROFILE.club} />
          </View>

          <Text style={styles.sectionTitle}>Trayectoria</Text>
          <View style={styles.list}>
            {MY_PROFILE.career.map((item) => (
              <View key={item.year} style={styles.careerRow}>
                <View style={styles.careerDot} />
                <View style={styles.careerBody}>
                  <Text style={styles.careerClub}>{item.club}</Text>
                  <Text style={styles.careerDetail}>
                    {item.detail} · {item.year}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Completá tu perfil</Text>
          <Text style={styles.emptyText}>
            Acá vas a poder cargar tu experiencia y los datos de tu{" "}
            {user.role === "agency" ? "agencia" : user.role === "club" ? "club" : "trabajo"}.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  username: { fontSize: 20, fontWeight: "500", color: COLORS.ink },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 20,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 30, fontWeight: "400", color: COLORS.primaryDark },
  statsRow: { flex: 1, flexDirection: "row", justifyContent: "space-around" },
  stat: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "500", color: COLORS.ink },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  bio: { paddingHorizontal: 16, marginTop: 14 },
  name: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  role: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  email: { fontSize: 13, color: COLORS.subtle, marginTop: 2 },
  actions: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    height: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.divider,
  },
  actionText: { fontSize: 13, fontWeight: "500", color: COLORS.ink },
  pressed: { opacity: 0.7 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.ink,
    paddingHorizontal: 16,
    marginTop: 26,
    marginBottom: 4,
  },
  list: {
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  infoLabel: { fontSize: 14, color: COLORS.muted },
  infoValue: { fontSize: 14, color: COLORS.ink },
  careerRow: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  careerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  careerBody: { flex: 1 },
  careerClub: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  careerDetail: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  empty: { paddingHorizontal: 16, marginTop: 32, alignItems: "center" },
  emptyTitle: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  emptyText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 4,
  },
});
