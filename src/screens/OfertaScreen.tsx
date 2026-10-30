import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Offer } from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  offer: Offer;
  applied: boolean;
  onBack: () => void;
  onApply: () => void;
};

export default function OfertaScreen({ offer, applied, onBack, onApply }: Props) {
  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
        </Pressable>
        <Text style={styles.topTitle}>Oferta</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.location}>
          {offer.flag} {offer.country} · {offer.region}
        </Text>
        <Text style={styles.title}>{offer.title}</Text>
        <Text style={styles.club}>
          {offer.club} · {offer.league}
        </Text>

        <View style={styles.salaryBox}>
          <Text style={styles.salaryLabel}>SALARIO</Text>
          <Text style={styles.salary}>{offer.salary}</Text>
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.body}>{offer.description}</Text>

        <Text style={styles.sectionTitle}>Requisitos</Text>
        {offer.requirements.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Ionicons name="checkmark" size={16} color={COLORS.primaryDark} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Beneficios</Text>
        {offer.benefits.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Ionicons name="add-circle-outline" size={16} color={COLORS.primaryDark} />
            <Text style={styles.bulletText}>{item}</Text>
          </View>
        ))}

        <Text style={styles.posted}>{offer.posted}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          onPress={onApply}
          disabled={applied}
          style={({ pressed }) => [
            styles.applyButton,
            applied && styles.appliedButton,
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={[styles.applyText, applied && styles.appliedText]}>
            {applied ? "Postulación enviada ✓" : "Aplicar ahora"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 16, fontWeight: "700", color: COLORS.ink },
  content: { padding: 16, paddingBottom: 24 },
  location: { fontSize: 12, color: COLORS.muted },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.ink,
    marginTop: 4,
  },
  club: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  salaryBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  salaryLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: COLORS.subtle,
  },
  salary: { fontSize: 20, fontWeight: "700", color: COLORS.ink, marginTop: 2 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.ink,
    marginTop: 20,
    marginBottom: 8,
  },
  body: { fontSize: 14, lineHeight: 21, color: COLORS.ink },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20, color: COLORS.ink },
  posted: { fontSize: 12, color: COLORS.muted, marginTop: 20 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  appliedButton: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  applyText: { fontSize: 15, fontWeight: "700", color: COLORS.white },
  appliedText: { color: COLORS.primaryDark },
});
