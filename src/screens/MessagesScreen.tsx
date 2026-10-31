import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { Thread } from "../data";
import { timeAgo } from "../i18n/format";
import { COLORS, RADIUS } from "../theme";

export function threadTitle(thread: Thread, t: (k: string) => string) {
  return thread.subjectKey ? t(thread.subjectKey) : (thread.subject ?? "");
}

export function lastPreview(thread: Thread, t: (k: string) => string) {
  const last = thread.messages[thread.messages.length - 1];
  if (!last) return "";
  const text = last.bodyKey ? t(last.bodyKey) : (last.body ?? "");
  return last.fromMe ? `${t("messages.you")}: ${text}` : text;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

type Props = {
  threads: Thread[];
  onOpen: (thread: Thread) => void;
  onBack: () => void;
};

export default function MessagesScreen({ threads, onOpen, onBack }: Props) {
  const { t } = useTranslation();
  const [onlyUnread, setOnlyUnread] = useState(false);

  const sorted = [...threads].sort((a, b) => a.hoursAgo - b.hoursAgo);
  const visible = onlyUnread ? sorted.filter((th) => th.unread) : sorted;

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("messages.title")} onBack={onBack} />

      <View style={styles.tabs}>
        {[
          { unread: false, label: t("messages.all") },
          { unread: true, label: t("messages.unread") },
        ].map((item) => {
          const active = onlyUnread === item.unread;
          return (
            <Pressable
              key={item.label}
              onPress={() => setOnlyUnread(item.unread)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={visible}
        keyExtractor={(th) => th.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {onlyUnread ? t("messages.emptyUnread") : t("messages.empty")}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => onOpen(item)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <View style={styles.avatar}>
              {item.kind === "SYSTEM" ? (
                <Ionicons name="notifications-outline" size={20} color={COLORS.primaryDark} />
              ) : (
                <Text style={styles.avatarText}>{initials(item.withName)}</Text>
              )}
            </View>
            <View style={styles.body}>
              <View style={styles.topLine}>
                <Text
                  style={[styles.name, item.unread && styles.nameUnread]}
                  numberOfLines={1}
                >
                  {item.withName}
                </Text>
                <Text style={styles.time}>{timeAgo(t, item.hoursAgo)}</Text>
              </View>
              <Text style={styles.subject} numberOfLines={1}>
                {threadTitle(item, t)}
              </Text>
              <View style={styles.bottomLine}>
                <Text style={styles.preview} numberOfLines={1}>
                  {lastPreview(item, t)}
                </Text>
                {item.status !== "OPEN" && (
                  <Text style={styles.status}>{t(`status.${item.status}`)}</Text>
                )}
              </View>
            </View>
            {item.unread && <View style={styles.dot} />}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  tabs: { flexDirection: "row", gap: 8, padding: 16, paddingBottom: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  chipActive: { backgroundColor: COLORS.primarySoft, borderColor: COLORS.primaryBorder },
  chipText: { fontSize: 13, fontWeight: "500", color: COLORS.muted },
  chipTextActive: { color: COLORS.primaryDark },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowPressed: { backgroundColor: COLORS.surface },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 15, color: COLORS.primaryDark, fontWeight: "500" },
  body: { flex: 1 },
  topLine: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  name: { flex: 1, fontSize: 15, color: COLORS.ink },
  nameUnread: { fontWeight: "500" },
  time: { fontSize: 12, color: COLORS.muted },
  subject: { fontSize: 13, color: COLORS.ink, marginTop: 2 },
  bottomLine: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  preview: { flex: 1, fontSize: 13, color: COLORS.muted },
  status: { fontSize: 12, color: COLORS.muted },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  empty: { textAlign: "center", color: COLORS.muted, marginTop: 40 },
});
