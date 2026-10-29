import { Pressable, StyleSheet, Text, View } from "react-native";
import { Offer } from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  offer: Offer;
  applied: boolean;
  onOpen: () => void;
  onApply: () => void;
};

export default function OfferCard({ offer, applied, onOpen, onApply }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.location}>
        {offer.flag} {offer.country} · {offer.region}
      </Text>
      <Text style={styles.title}>{offer.title}</Text>

      <View style={styles.salaryRow}>
        <Text style={styles.salaryLabel}>SALARIO</Text>
        <Text style={styles.salary}>{offer.salary}</Text>
      </View>

      <Text style={styles.posted}>{offer.posted}</Text>

      <View style={styles.buttonsRow}>
        <Pressable
          onPress={onOpen}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.secondaryButtonText}>Ver oferta</Text>
        </Pressable>
        <Pressable
          onPress={onApply}
          disabled={applied}
          style={({ pressed }) => [
            styles.primaryButton,
            applied && styles.appliedButton,
            pressed && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              applied && styles.appliedButtonText,
            ]}
          >
            {applied ? "Postulado ✓" : "Aplicar ahora"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
  },
  location: { fontSize: 12, color: COLORS.muted },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 4,
  },
  salaryRow: { marginTop: 10 },
  salaryLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
    color: COLORS.subtle,
  },
  salary: { fontSize: 15, fontWeight: "700", color: COLORS.green },
  posted: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },
  secondaryButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  secondaryButtonText: { fontSize: 13, fontWeight: "600", color: "#374151" },
  primaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.green,
  },
  primaryButtonText: { fontSize: 13, fontWeight: "700", color: COLORS.white },
  appliedButton: {
    backgroundColor: COLORS.greenLight,
    borderWidth: 1,
    borderColor: COLORS.green,
  },
  appliedButtonText: { color: COLORS.green },
  pressed: { opacity: 0.8 },
});
