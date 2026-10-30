import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "./AppText";
import { Offer } from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  offer: Offer;
  applied: boolean;
  onOpen: () => void;
  onApply: () => void;
};

// Tarjeta plana tipo LinkedIn: toda la tarjeta abre la oferta y la acción
// secundaria es un link de texto (el botón verde lleno queda para el detalle).
export default function OfferCard({ offer, applied, onOpen, onApply }: Props) {
  return (
    <Pressable
      onPress={onOpen}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.location}>
        {offer.flag} {offer.country} · {offer.region}
      </Text>
      <Text style={styles.title}>{offer.title}</Text>
      <Text style={styles.club}>
        {offer.club} · {offer.league}
      </Text>
      <Text style={styles.salary}>{offer.salary}</Text>

      <View style={styles.footer}>
        <Text style={styles.posted}>{offer.posted}</Text>
        <Pressable onPress={onApply} disabled={applied} hitSlop={10}>
          {applied ? (
            <View style={styles.appliedRow}>
              <Ionicons name="checkmark" size={14} color={COLORS.primaryDark} />
              <Text style={styles.action}>Postulado</Text>
            </View>
          ) : (
            <Text style={styles.action}>Postularme →</Text>
          )}
        </Pressable>
      </View>
    </Pressable>
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
  pressed: { backgroundColor: COLORS.surface },
  location: { fontSize: 12, color: COLORS.muted },
  title: { fontSize: 16, fontWeight: "500", color: COLORS.ink, marginTop: 4 },
  club: { fontSize: 14, color: COLORS.muted, marginTop: 2 },
  salary: { fontSize: 14, fontWeight: "500", color: COLORS.ink, marginTop: 8 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  posted: { fontSize: 12, color: COLORS.muted },
  appliedRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  action: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark },
});
