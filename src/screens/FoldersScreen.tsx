import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { Folder, MOCK_PLAYERS, Player } from "../data";
import { tc } from "../i18n";
import { COLORS, FONT, RADIUS } from "../theme";

type Props = {
  folders: Folder[];
  onCreate: (name: string) => void;
  onRemovePlayer: (folderId: string, playerId: string) => void;
  onOpenPlayer: (player: Player) => void;
  onBack: () => void;
};

export default function FoldersScreen({ folders, onCreate, onRemovePlayer, onOpenPlayer, onBack }: Props) {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const open = folders.find((f) => f.id === openId) ?? null;

  const create = () => {
    const value = name.trim();
    if (value === "") return;
    onCreate(value);
    setName("");
  };

  if (open) {
    const players = open.playerIds
      .map((id) => MOCK_PLAYERS.find((p) => p.id === id))
      .filter((p): p is Player => p !== undefined);
    return (
      <View style={styles.screen}>
        <ScreenHeader title={open.name} onBack={() => setOpenId(null)} />
        <ScrollView contentContainerStyle={styles.content}>
          {players.length === 0 && <Text style={styles.empty}>{t("folders.emptyFolder")}</Text>}
          {players.map((player) => (
            <Pressable
              key={player.id}
              onPress={() => onOpenPlayer(player)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{player.name}</Text>
                <Text style={styles.rowMeta}>
                  {tc(player.position)} · {t("player.age", { count: player.age })}
                </Text>
              </View>
              <Pressable
                onPress={() => onRemovePlayer(open.id, player.id)}
                hitSlop={8}
                accessibilityLabel={t("folders.remove")}
              >
                <Ionicons name="close-circle-outline" size={22} color={COLORS.muted} />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("folders.title")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.newRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t("folders.namePlaceholder")}
            placeholderTextColor={COLORS.subtle}
            style={styles.input}
            onSubmitEditing={create}
          />
          <Pressable onPress={create} style={styles.create}>
            <Text style={styles.createText}>{t("folders.create")}</Text>
          </Pressable>
        </View>

        {folders.length === 0 && <Text style={styles.empty}>{t("folders.empty")}</Text>}
        {folders.map((folder) => (
          <Pressable
            key={folder.id}
            onPress={() => setOpenId(folder.id)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Ionicons name="folder-outline" size={22} color={COLORS.ink} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{folder.name}</Text>
              <Text style={styles.rowMeta}>
                {t("folders.playersCount", { count: folder.playerIds.length })}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  newRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    color: COLORS.ink,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  create: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  createText: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowPressed: { backgroundColor: COLORS.surface },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, color: COLORS.ink },
  rowMeta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 32, paddingHorizontal: 24, lineHeight: 20 },
});
