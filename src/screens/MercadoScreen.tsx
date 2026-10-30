import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import OfferCard from "../components/OfferCard";
import { MOCK_OFFERS, Offer } from "../data";
import { COLORS, RADIUS } from "../theme";

type Filter = "all" | "player" | "staff";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "player", label: "Jugadores" },
  { key: "staff", label: "Staff" },
];

type Props = {
  appliedIds: string[];
  onOpenOffer: (offer: Offer) => void;
  onApply: (offerId: string) => void;
};

export default function MercadoScreen({ appliedIds, onOpenOffer, onApply }: Props) {
  const [filter, setFilter] = useState<Filter>("all");

  const offers =
    filter === "all"
      ? MOCK_OFFERS
      : MOCK_OFFERS.filter((offer) => offer.type === filter);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>Mercado</Text>
        <Text style={styles.subheading}>
          {offers.length} oportunidades encontradas
        </Text>

        <View style={styles.filtersRow}>
          {FILTERS.map((item) => {
            const active = filter === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setFilter(item.key)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={offers}
        keyExtractor={(offer) => offer.id}
        renderItem={({ item }) => (
          <OfferCard
            offer={item}
            applied={appliedIds.includes(item.id)}
            onOpen={() => onOpenOffer(item)}
            onApply={() => onApply(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  heading: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  subheading: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  filtersRow: { flexDirection: "row", gap: 8, marginTop: 14 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryBorder,
  },
  chipText: { fontSize: 13, fontWeight: "500", color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark },
  list: { padding: 16, gap: 12 },
});
