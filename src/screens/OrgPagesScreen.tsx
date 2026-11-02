import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import ScreenHeader from "../components/ScreenHeader";
import { OrgPage, OrgStatus } from "../data";
import { COLORS, RADIUS } from "../theme";

type Props = {
  pages: OrgPage[];
  onOpen: (page: OrgPage) => void;
  onCreate: () => void;
  onBack: () => void;
};

export const STATUS_KEY: Record<OrgStatus, string> = {
  APPROVED: "statusPublished",
  DRAFT: "statusDraft",
  PENDING_REVIEW: "statusInReview",
  REJECTED: "statusRejected",
  DEACTIVATED: "statusDeactivated",
};

// Mis páginas: las organizaciones (club, academia, agencia…) que administra el usuario.
export default function OrgPagesScreen({ pages, onOpen, onCreate, onBack }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("org.myPagesTitle")} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {pages.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t("org.myPagesEmpty")}</Text>
          </View>
        )}
        {pages.map((page) => (
          <Pressable
            key={page.id}
            onPress={() => onOpen(page)}
            style={({ pressed }) => [styles.row, pressed && { backgroundColor: COLORS.surface }]}
          >
            <View style={styles.logo}>
              <Text style={styles.logoText}>{page.name.slice(0, 1).toUpperCase()}</Text>
            </View>
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={1}>
                {page.name}
              </Text>
              <Text style={styles.meta}>
                {t(`org.type${page.type}`)} · {t(`org.${STATUS_KEY[page.status]}`)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
          </Pressable>
        ))}
        <Pressable onPress={onCreate} style={({ pressed }) => [styles.create, pressed && { opacity: 0.85 }]}>
          <Ionicons name="add" size={20} color={COLORS.white} />
          <Text style={styles.createText}>{pages.length === 0 ? t("org.createFirstPage") : t("org.createPageCta")}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16, paddingBottom: 32 },
  empty: { paddingVertical: 24 },
  emptyText: { fontSize: 14, color: COLORS.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: { fontSize: 18, fontWeight: "500", color: COLORS.primaryDark },
  body: { flex: 1 },
  name: { fontSize: 16, color: COLORS.ink },
  meta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  create: {
    marginTop: 20,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  createText: { fontSize: 15, fontWeight: "500", color: COLORS.white },
});
