import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MOCK_PLAYERS, POSITIONS, Player } from "../data";
import { COLORS, RADIUS } from "../theme";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function PlayerCard({ player }: { player: Player }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(player.name)}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {player.name}
          </Text>
          {player.verified && (
            <Ionicons name="checkmark-circle" size={16} color={COLORS.green} />
          )}
        </View>
        <Text style={styles.meta}>
          {player.position} · {player.age} años
        </Text>
        <Text style={styles.meta}>
          {player.flag} {player.country} · {player.club}
        </Text>
      </View>
    </View>
  );
}

export default function BuscarScreen() {
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState("Todas");

  const text = query.trim().toLowerCase();
  const players = MOCK_PLAYERS.filter((player) => {
    const matchesPosition = position === "Todas" || player.position === position;
    const matchesText =
      text === "" ||
      player.name.toLowerCase().includes(text) ||
      player.club.toLowerCase().includes(text) ||
      player.country.toLowerCase().includes(text);
    return matchesPosition && matchesText;
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.heading}>Buscar</Text>
        <Text style={styles.subheading}>
          {players.length} perfiles encontrados
        </Text>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Nombre, club o país"
            placeholderTextColor={COLORS.subtle}
            style={styles.input}
          />
        </View>

        <FlatList
          horizontal
          data={POSITIONS}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          renderItem={({ item }) => {
            const active = item === position;
            return (
              <Pressable
                onPress={() => setPosition(item)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={players}
        keyExtractor={(player) => player.id}
        renderItem={({ item }) => <PlayerCard player={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>No se encontraron perfiles.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  heading: { fontSize: 26, fontWeight: "800", color: COLORS.greenDark },
  subheading: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  input: { flex: 1, paddingVertical: 10, fontSize: 14, color: COLORS.text },
  chipsRow: { gap: 8, paddingTop: 12 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORS.muted },
  chipTextActive: { color: COLORS.white },
  list: { padding: 16, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.greenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, fontWeight: "800", color: COLORS.green },
  cardBody: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 15, fontWeight: "700", color: COLORS.text, flexShrink: 1 },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 32 },
});
