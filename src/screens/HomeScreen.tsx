import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import { ApplicationStatus, AppNotification, MyOffer, Offer, Plans, Profile, Role, User } from "../data";
import { timeAgo } from "../i18n/format";
import { COLORS, RADIUS } from "../theme";
import { StatusPill } from "./MyApplicationsScreen";
import { NotificationRow } from "./NotificationsScreen";

type Props = {
  offers: Offer[];
  user: User;
  profile: Profile;
  plans: Plans;
  appliedIds: string[];
  myOffers: MyOffer[];
  notifications: AppNotification[];
  verified: boolean;
  representedCount: number;
  creditsLeft: number;
  onOpenOffer: (offer: Offer) => void;
  onSearchOffers: () => void;
  onEditProfile: () => void;
  onOpenPlan: () => void;
  onOpenSuccess: () => void;
  onOpenNotifications: () => void;
  onOpenApplications: () => void;
  appStatuses: Record<string, ApplicationStatus>;
  onOpenMyOffer: (offer: MyOffer) => void;
  onPublish: () => void;
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// Porcentaje de perfil completo y qué falta (como la barra de progreso de la web).
function completeness(role: Role, name: string, profile: Profile) {
  const items: { key: string; done: boolean }[] = [
    { key: "photo", done: profile.hasPhoto },
    { key: "name", done: name.trim().length >= 2 },
    { key: "phone", done: profile.phone.trim() !== "" },
    { key: "country", done: profile.nationality.trim() !== "" },
    { key: "location", done: profile.location.trim() !== "" },
    { key: "social", done: profile.social.trim() !== "" },
  ];
  if (role === "player") {
    items.push(
      { key: "position", done: profile.position !== "" },
      { key: "body", done: profile.heightCm !== "" && profile.weightKg !== "" },
      { key: "video", done: profile.videoUrls.length > 0 },
    );
  }
  const done = items.filter((i) => i.done).length;
  return { percent: Math.round((done / items.length) * 100), missing: items.filter((i) => !i.done) };
}

// Inicio: el resumen que muestra la web al entrar, según el tipo de cuenta.
export default function HomeScreen(props: Props) {
  const { t } = useTranslation();
  const { user, profile, plans, appliedIds, myOffers, notifications } = props;
  const isAgency = user.role === "agency";
  const isSeeker = user.role !== "agency"; // futbolista y staff se postulan
  const isOfferer = user.role !== "player"; // staff y agencia publican
  const firstName = user.name.split(" ")[0];

  const applied = props.offers.filter((o) => appliedIds.includes(o.id));
  const feed = notifications.filter((n) => n.audience === (isOfferer && isAgency ? "offerer" : "seeker"));
  const candidates = myOffers.flatMap((o) => o.candidates);
  const { percent, missing } = completeness(user.role, user.name, profile);
  const planName = isAgency
    ? t(`plan.recruit_${plans.recruit}`)
    : t(`plan.visibility_${plans.visibility}`);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hello}>
        <Text style={styles.heading}>{t("home.hello", { name: firstName })}</Text>
        {props.verified && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
      </View>
      <Text style={styles.subtitle}>{t(isAgency ? "home.subtitleAgency" : "home.subtitleSeeker")}</Text>

      <View style={styles.stats}>
        {isAgency ? (
          <>
            <Stat value={myOffers.filter((o) => o.status === "ACTIVE").length} label={t("panel.activeOffers")} />
            <Stat value={candidates.length} label={t("panel.candidates")} />
            <Stat value={props.representedCount} label={t("home.represented")} />
          </>
        ) : (
          <>
            <Stat value={appliedIds.length} label={t("home.sent")} />
            <Stat value={notifications.filter((n) => n.type === "PROFILE_VIEW").length} label={t("home.visits")} />
            <Stat value={notifications.filter((n) => n.type === "APPLICATION_INTEREST").length} label={t("panel.interested")} />
          </>
        )}
      </View>

      {percent < 100 && (
        <Pressable onPress={props.onEditProfile} style={styles.card}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>{t("home.profileComplete", { percent })}</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.cardHint}>
            {t("home.missing", { items: missing.slice(0, 3).map((m) => t(`home.item_${m.key}`)).join(", ") })}
          </Text>
        </Pressable>
      )}

      {isAgency ? (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.section}>{t("panel.myOffers")}</Text>
            <Pressable onPress={props.onPublish} hitSlop={8}>
              <Text style={styles.link}>{t("panel.publish")}</Text>
            </Pressable>
          </View>
          {myOffers.length === 0 && <Text style={styles.empty}>{t("panel.noOffers")}</Text>}
          {myOffers.slice(0, 3).map((offer) => (
            <Pressable key={offer.id} onPress={() => props.onOpenMyOffer(offer)} style={styles.row}>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {offer.title}
                </Text>
                <Text style={styles.rowMeta}>
                  {t("panel.candidatesCount", { count: offer.candidates.length })} · {timeAgo(t, offer.postedHoursAgo)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
            </Pressable>
          ))}
          <Text style={styles.cardHint}>{t("home.credits", { count: props.creditsLeft })}</Text>
        </>
      ) : (
        <>
          <View style={styles.sectionRow}>
            <Text style={styles.section}>{t("home.sent")}</Text>
            <Pressable onPress={applied.length ? props.onOpenApplications : props.onSearchOffers} hitSlop={8}>
              <Text style={styles.link}>{applied.length ? t("home.seeAllApps") : t("home.searchOffers")}</Text>
            </Pressable>
          </View>
          {applied.length === 0 ? (
            <Text style={styles.empty}>{t("home.noApplications")}</Text>
          ) : (
            applied.slice(0, 5).map((offer) => (
              <Pressable key={offer.id} onPress={() => props.onOpenOffer(offer)} style={styles.row}>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {offer.title}
                  </Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>
                    {offer.club}
                  </Text>
                </View>
                <StatusPill status={props.appStatuses[offer.id] ?? "PENDING"} />
                <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
              </Pressable>
            ))
          )}
        </>
      )}

      <View style={styles.sectionRow}>
        <Text style={styles.section}>{t("home.recentNotices")}</Text>
        <Pressable onPress={props.onOpenNotifications} hitSlop={8}>
          <Text style={styles.link}>{t("home.seeAll")}</Text>
        </Pressable>
      </View>
      {feed.length === 0 && <Text style={styles.empty}>{t("notif.empty")}</Text>}
      {feed.slice(0, 4).map((item) => (
        <NotificationRow key={item.id} item={item} />
      ))}

      <Pressable onPress={props.onOpenPlan} style={[styles.card, styles.planCard]}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardHint}>{t("plan.title")}</Text>
            <Text style={styles.cardTitle}>{planName}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
        </View>
      </Pressable>

      <Pressable onPress={props.onOpenSuccess} style={[styles.card, styles.planCard]}>
        <View style={styles.cardTop}>
          <View>
            <Text style={styles.cardHint}>{t("success.badge")}</Text>
            <Text style={styles.cardTitle}>{t("success.kicker")}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.subtle} />
        </View>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 32 },
  hello: { flexDirection: "row", alignItems: "center", gap: 6 },
  heading: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 4 },
  stats: {
    flexDirection: "row",
    marginTop: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.divider,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "500", color: COLORS.ink },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2, textAlign: "center" },
  card: {
    marginTop: 16,
    padding: 14,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planCard: { marginTop: 24 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 15, fontWeight: "500", color: COLORS.ink },
  cardHint: { fontSize: 12, color: COLORS.muted, marginTop: 8, lineHeight: 17 },
  track: { height: 6, borderRadius: 3, backgroundColor: COLORS.divider, marginTop: 10, overflow: "hidden" },
  fill: { height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  sectionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 4 },
  section: { fontSize: 16, fontWeight: "500", color: COLORS.ink },
  link: { fontSize: 13, fontWeight: "500", color: COLORS.primaryDark },
  empty: { fontSize: 14, color: COLORS.muted, marginTop: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 15, color: COLORS.ink },
  rowMeta: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
});
