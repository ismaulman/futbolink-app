import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { Thread } from "../data";
import { timeAgo } from "../i18n/format";
import { COLORS, FONT, RADIUS } from "../theme";
import { threadTitle } from "./MessagesScreen";

type Props = {
  thread: Thread;
  onBack: () => void;
  onSend: (text: string) => void;
  onRespond: (accept: boolean) => void;
  onCounter: (text: string) => void;
};

export default function ThreadScreen({ thread, onBack, onSend, onRespond, onCounter }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [countering, setCountering] = useState(false);
  const scroll = useRef<ScrollView>(null);

  const canRespond = thread.kind === "PROPOSAL" && thread.status === "OPEN" && thread.iAmRecipient;
  const closed =
    thread.kind === "SYSTEM" || thread.status === "REJECTED" || thread.status === "EXPIRED";
  const waiting = thread.kind === "PLAYER_PROP" && thread.status === "OPEN" && !thread.iAmRecipient;

  const submit = () => {
    const value = text.trim();
    if (value === "") return;
    if (countering) onCounter(value);
    else onSend(value);
    setText("");
    setCountering(false);
  };

  const showComposer = !closed && (!canRespond || countering);

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenHeader title={thread.withName} onBack={onBack} />

      <View style={styles.subjectBox}>
        <Text style={styles.subject}>{threadTitle(thread, t)}</Text>
        <Text style={styles.subjectMeta}>
          {t(`kind.${thread.kind}`)} · {t(`status.${thread.status}`)}
        </Text>
      </View>

      <ScrollView
        ref={scroll}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      >
        {thread.messages.map((m) => (
          <View key={m.id} style={[styles.bubbleRow, m.fromMe && styles.bubbleRowMe]}>
            <View style={[styles.bubble, m.fromMe ? styles.bubbleMe : styles.bubbleOther]}>
              <Text style={styles.bubbleText}>{m.bodyKey ? t(m.bodyKey) : m.body}</Text>
              <Text style={styles.bubbleTime}>{timeAgo(t, m.hoursAgo)}</Text>
            </View>
          </View>
        ))}
        {waiting && <Text style={styles.note}>{t("messages.waiting")}</Text>}
      </ScrollView>

      {canRespond && !countering && (
        <View style={styles.actions}>
          <Pressable
            onPress={() => onRespond(true)}
            style={({ pressed }) => [styles.accept, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.acceptText}>{t("messages.accept")}</Text>
          </Pressable>
          <View style={styles.secondaryRow}>
            <Pressable onPress={() => onRespond(false)} style={styles.secondary}>
              <Text style={styles.secondaryText}>{t("messages.reject")}</Text>
            </Pressable>
            <Pressable onPress={() => setCountering(true)} style={styles.secondary}>
              <Text style={styles.secondaryText}>{t("messages.counter")}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {closed && thread.kind !== "SYSTEM" && (
        <Text style={[styles.note, styles.closed]}>{t("messages.closed")}</Text>
      )}

      {showComposer && (
        <View style={styles.composer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={countering ? t("messages.counterPlaceholder") : t("messages.placeholder")}
            placeholderTextColor={COLORS.subtle}
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={submit}
            hitSlop={8}
            accessibilityLabel={countering ? t("messages.counterSend") : t("messages.send")}
          >
            <Ionicons name="send" size={22} color={text.trim() ? COLORS.primary : COLORS.subtle} />
          </Pressable>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  subjectBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  subject: { fontSize: 14, color: COLORS.ink },
  subjectMeta: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  messages: { padding: 16, gap: 10 },
  bubbleRow: { flexDirection: "row" },
  bubbleRowMe: { justifyContent: "flex-end" },
  bubble: { maxWidth: "82%", padding: 12, borderRadius: RADIUS.md },
  bubbleOther: { backgroundColor: COLORS.divider },
  bubbleMe: { backgroundColor: COLORS.primarySoft, borderWidth: 1, borderColor: COLORS.primaryBorder },
  bubbleText: { fontSize: 14, lineHeight: 20, color: COLORS.ink },
  bubbleTime: { fontSize: 11, color: COLORS.muted, marginTop: 4 },
  note: { fontSize: 13, color: COLORS.muted, textAlign: "center", marginTop: 8 },
  closed: { padding: 16 },
  actions: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  accept: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
  secondaryRow: { flexDirection: "row", gap: 8 },
  secondary: {
    flex: 1,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  input: {
    flex: 1,
    fontFamily: FONT.regular,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.ink,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surface,
  },
});
