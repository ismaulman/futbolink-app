import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { AppNotification, NotificationType } from "../data";
import { timeAgo } from "../i18n/format";
import { COLORS } from "../theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export const NOTIF_ICON: Record<NotificationType, IconName> = {
  PROFILE_VIEW: "eye-outline",
  APPLICATION_IN_REVIEW: "time-outline",
  APPLICATION_PROFILE_VIEWED: "eye-outline",
  APPLICATION_INTEREST: "heart-outline",
  JOB_MATCH: "briefcase-outline",
  PROPOSAL_RECEIVED: "paper-plane-outline",
  APPLICATION_RECEIVED: "person-add-outline",
  TALENT_MATCH: "sparkles-outline",
};

// Una fila de aviso (se usa acá y en el Inicio).
export function NotificationRow({ item }: { item: AppNotification }) {
  const { t } = useTranslation();
  return (
    <View style={styles.row}>
      <Ionicons name={NOTIF_ICON[item.type]} size={20} color={COLORS.ink} />
      <View style={styles.body}>
        <Text style={styles.text}>
          {t(`notif.${item.type}`, { who: item.who ?? "", offer: item.offer ?? "" })}
        </Text>
        <Text style={styles.time}>{timeAgo(t, item.hoursAgo)}</Text>
      </View>
      {!item.read && <View style={styles.dot} />}
    </View>
  );
}

type Props = {
  items: AppNotification[];
  onMarkAllRead: () => void;
  onBack: () => void;
};

export default function NotificationsScreen({ items, onMarkAllRead, onBack }: Props) {
  const { t } = useTranslation();
  const hasUnread = items.some((n) => !n.read);
  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={t("notif.title")}
        onBack={onBack}
        right={
          hasUnread ? (
            <Pressable onPress={onMarkAllRead} hitSlop={8}>
              <Text style={styles.markAll}>{t("notif.markAll")}</Text>
            </Pressable>
          ) : undefined
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        {items.length === 0 && <Text style={styles.time}>{t("notif.empty")}</Text>}
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  body: { flex: 1 },
  text: { fontSize: 14, color: COLORS.ink, lineHeight: 20 },
  time: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  markAll: { fontSize: 13, color: COLORS.primaryDark, fontWeight: "500" },
});
