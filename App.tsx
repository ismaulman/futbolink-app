import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./src/i18n";
import i18n from "./src/i18n";
import TabBar, { TabKey } from "./src/components/TabBar";
import TopBar from "./src/components/TopBar";
import {
  ChatMessage,
  AgencyApplication,
  Folder,
  INITIAL_FOLDERS,
  EMPTY_ORG,
  AppNotification,
  ApplicationStatus,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAGES,
  INITIAL_PLANS,
  INITIAL_PORTFOLIO,
  MONTHLY_CREDITS,
  OrgPage,
  Plans,
  PortfolioEntry,
  VerificationStatus,
  INITIAL_MY_OFFERS,
  INITIAL_PREFS,
  INITIAL_PROFILE,
  MOCK_OFFERS,
  MOCK_THREADS,
  MyOffer,
  NotificationPrefs,
  Offer,
  Player,
  Profile,
  Thread,
  User,
} from "./src/data";
import { tc } from "./src/i18n";
import AuthScreen from "./src/screens/AuthScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import ThreadScreen from "./src/screens/ThreadScreen";
import BuscarScreen from "./src/screens/BuscarScreen";
import CandidatesScreen from "./src/screens/CandidatesScreen";
import FoldersScreen from "./src/screens/FoldersScreen";
import MatchScreen from "./src/screens/MatchScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SuccessCasesScreen from "./src/screens/SuccessCasesScreen";
import HelpScreen from "./src/screens/HelpScreen";
import MyApplicationsScreen from "./src/screens/MyApplicationsScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import OrgFormScreen from "./src/screens/OrgFormScreen";
import OrgPageScreen from "./src/screens/OrgPageScreen";
import OrgPagesScreen from "./src/screens/OrgPagesScreen";
import PlanScreen from "./src/screens/PlanScreen";
import VerificationScreen from "./src/screens/VerificationScreen";
import PortfolioScreen from "./src/screens/PortfolioScreen";
import PanelScreen from "./src/screens/PanelScreen";
import PublishOfferScreen from "./src/screens/PublishOfferScreen";
import ExploreScreen from "./src/screens/ExploreScreen";
import OfertaScreen from "./src/screens/OfertaScreen";
import PlayerProfileScreen from "./src/screens/PlayerProfileScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { COLORS } from "./src/theme";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const [user, setUser] = useState<User | null>(null);
  const [tab, setTab] = useState<TabKey>("inicio");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  // Estado de cada postulación (hoy "Postulado"; llega real con la plataforma conectada).
  const [appStatuses] = useState<Record<string, ApplicationStatus>>({});
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [savedPlayerIds, setSavedPlayerIds] = useState<string[]>([]);
  const [proposalIds, setProposalIds] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<
    "edit" | "settings" | "messages" | "publish" | "candidates" | "folders" | "portfolio" | "match" | "plan" | "verification" | "pages" | "pageForm" | "pageDetail" | "notifications" | "applications" | "help" | "success" | null
  >(null);
  const [myOffers, setMyOffers] = useState<MyOffer[]>(INITIAL_MY_OFFERS);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [publishedOffers, setPublishedOffers] = useState<Offer[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [pages, setPages] = useState<OrgPage[]>(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState(false);
  const [plans, setPlans] = useState<Plans>(INITIAL_PLANS);
  const [verification, setVerification] = useState<VerificationStatus>("none");
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>(INITIAL_PORTFOLIO);
  const [agencyApps, setAgencyApps] = useState<AgencyApplication[]>([]);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [threads, setThreads] = useState<Thread[]>(MOCK_THREADS);
  const [openThreadId, setOpenThreadId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [prefs, setPrefs] = useState<NotificationPrefs>(INITIAL_PREFS);

  const apply = (offerId: string) => {
    setAppliedIds((current) =>
      current.includes(offerId) ? current : [...current, offerId],
    );
  };

  const toggleSave = (offerId: string) => {
    setSavedIds((current) =>
      current.includes(offerId)
        ? current.filter((id) => id !== offerId)
        : [...current, offerId],
    );
  };

  const toggleSavePlayer = (playerId: string) => {
    setSavedPlayerIds((current) =>
      current.includes(playerId)
        ? current.filter((id) => id !== playerId)
        : [...current, playerId],
    );
  };

  const addMessage = (
    threadId: string,
    message: Omit<ChatMessage, "id" | "fromMe" | "hoursAgo">,
    status?: Thread["status"],
  ) => {
    setThreads((current) =>
      current.map((th) =>
        th.id === threadId
          ? {
              ...th,
              status: status ?? th.status,
              hoursAgo: 0,
              messages: [
                ...th.messages,
                { ...message, id: `${th.id}-${th.messages.length + 1}`, fromMe: true, hoursAgo: 0 },
              ],
            }
          : th,
      ),
    );
  };

  const openThread = (thread: Thread) => {
    setThreads((current) =>
      current.map((th) => (th.id === thread.id ? { ...th, unread: false } : th)),
    );
    setOpenThreadId(thread.id);
  };

  const toggleCandidate = (playerId: string, field: "interested" | "shortlisted") => {
    setMyOffers((current) =>
      current.map((offer) =>
        offer.id === activeOfferId
          ? {
              ...offer,
              candidates: offer.candidates.map((c) =>
                c.playerId === playerId ? { ...c, viewed: true, [field]: !c[field] } : c,
              ),
            }
          : offer,
      ),
    );
  };

  // Al abrir la lista de postulantes, los que estaban "Postulados" pasan a "En revisión".
  const openOfferCandidates = (offer: MyOffer) => {
    setMyOffers((current) =>
      current.map((o) =>
        o.id === offer.id
          ? { ...o, candidates: o.candidates.map((c) => (c.viewed || c.interested ? c : { ...c, inReview: true })) }
          : o,
      ),
    );
    setActiveOfferId(offer.id);
    setOverlay("candidates");
  };

  const openCandidate = (player: Player) => {
    setMyOffers((current) =>
      current.map((offer) =>
        offer.id === activeOfferId
          ? {
              ...offer,
              candidates: offer.candidates.map((c) =>
                c.playerId === player.id ? { ...c, viewed: true } : c,
              ),
            }
          : offer,
      ),
    );
    setSelectedPlayer(player);
  };

  const createFolder = (name: string) => {
    setFolders((current) => [...current, { id: `f${Date.now()}`, name, playerIds: [] }]);
  };

  const removeFromFolder = (folderId: string, playerId: string) => {
    setFolders((current) =>
      current.map((f) =>
        f.id === folderId ? { ...f, playerIds: f.playerIds.filter((id) => id !== playerId) } : f,
      ),
    );
  };

  const toggleInFolder = (folderId: string, playerId: string) => {
    setFolders((current) =>
      current.map((f) =>
        f.id === folderId
          ? {
              ...f,
              playerIds: f.playerIds.includes(playerId)
                ? f.playerIds.filter((id) => id !== playerId)
                : [...f.playerIds, playerId],
            }
          : f,
      ),
    );
  };

  const changeTab = (next: TabKey) => {
    setActiveOfferId(null);
    setOpenThreadId(null);
    setSelectedOffer(null);
    setSelectedPlayer(null);
    setOverlay(null);
    setTab(next);
  };

  const logout = () => {
    setUser(null);
    setTab("mercado");
    setSelectedOffer(null);
    setAppliedIds([]);
    setThreads(MOCK_THREADS);
    setOpenThreadId(null);
    setMyOffers(INITIAL_MY_OFFERS);
    setFolders(INITIAL_FOLDERS);
    setActiveOfferId(null);
    setSavedIds([]);
    setSavedPlayerIds([]);
    setProposalIds([]);
    setSelectedPlayer(null);
    setOverlay(null);
    setProfile(INITIAL_PROFILE);
    setPlans(INITIAL_PLANS);
    setPages(INITIAL_PAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setPublishedOffers([]);
    setProposalIds([]);
    setMyOffers(INITIAL_MY_OFFERS);
    setTab("inicio");
    setVerification("none");
    setPrefs(INITIAL_PREFS);
  };

  if (!fontsLoaded) {
    return <View style={styles.root} />;
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <SafeAreaView style={styles.root}>
          <AuthScreen
            onSubmit={(next) => {
              setUser(next);
              // Los datos del registro pasan al perfil.
              setProfile((p) => ({
                ...p,
                phone: next.phone ?? p.phone,
                nationality: next.nationality || p.nationality,
              }));
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Los avisos de quien publica ofertas (agencia) son distintos a los de quien busca.
  // Las ofertas que publicás aparecen en el Mercado junto con las de ejemplo.
  const allOffers = [...publishedOffers, ...MOCK_OFFERS];
  const myAudience = user.role === "agency" ? "offerer" : "seeker";
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const openThreadData = threads.find((th) => th.id === openThreadId) ?? null;

  let content;
  if (selectedPlayer) {
    content = (
      <PlayerProfileScreen
        player={selectedPlayer}
        viewerRole={user.role}
        saved={savedPlayerIds.includes(selectedPlayer.id)}
        proposalSent={proposalIds.includes(selectedPlayer.id)}
        onToggleSave={() => toggleSavePlayer(selectedPlayer.id)}
        onSendProposal={() => {
          if (proposalIds.includes(selectedPlayer.id)) return;
          setProposalIds((c) => [...c, selectedPlayer.id]);
          setThreads((c) => [
            {
              id: `tp-${selectedPlayer.id}-${Date.now()}`,
              kind: "PROPOSAL",
              subject: i18n.t("messages.proposalSubject", { name: selectedPlayer.name }),
              withName: selectedPlayer.name,
              status: "OPEN",
              unread: false,
              iAmRecipient: false,
              hoursAgo: 0,
              messages: [
                {
                  id: `tpm-${Date.now()}`,
                  fromMe: true,
                  body: i18n.t("messages.proposalBody", { name: selectedPlayer.name }),
                  hoursAgo: 0,
                },
              ],
            },
            ...c,
          ]);
        }}
        folders={folders}
        onToggleFolder={(folderId) => toggleInFolder(folderId, selectedPlayer.id)}
        onBack={() => setSelectedPlayer(null)}
      />
    );
  } else if (overlay === "messages" && openThreadData) {
    content = (
      <ThreadScreen
        thread={openThreadData}
        onBack={() => setOpenThreadId(null)}
        onSend={(text) => addMessage(openThreadData.id, { body: text })}
        onCounter={(text) =>
          addMessage(openThreadData.id, { body: i18n.t("messages.counterPrefix") + text })
        }
        onRespond={(accept) =>
          addMessage(
            openThreadData.id,
            { bodyKey: accept ? "messages.youAccepted" : "messages.youRejected" },
            accept ? "ACCEPTED" : "REJECTED",
          )
        }
      />
    );
  } else if (overlay === "messages") {
    content = (
      <MessagesScreen
        threads={threads}
        onOpen={openThread}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "publish") {
    content = (
      <PublishOfferScreen
        onBack={() => setOverlay(null)}
        onPublish={(draft) => {
          const fallback = `${tc(draft.position)} – ${tc(draft.category)}`;
          const title = draft.title.trim() || fallback;
          const id = `mo${Date.now()}`;
          const knownFlag = MOCK_OFFERS.find((o) => o.country === draft.country.trim())?.flag;
          const ownPage = pages.find((p) => p.status === "APPROVED");
          setMyOffers((current) => [
            { id, type: draft.type, title, status: "ACTIVE", postedHoursAgo: 0, candidates: [] },
            ...current,
          ]);
          // En la plataforma la revisa el equipo antes de mostrarla; acá se aprueba al instante.
          setPublishedOffers((current) => [
            {
              id,
              type: draft.type,
              flag: knownFlag ?? "🌍",
              country: draft.country.trim(),
              region: [draft.city.trim(), draft.country.trim()].filter(Boolean).join(", "),
              club: ownPage?.name ?? user.name,
              league: "",
              title,
              salary: draft.salary ? `${draft.currency}${draft.salary}` : "",
              postedHoursAgo: 0,
              description: draft.description.trim(),
              positions: [draft.position],
              category: draft.category,
              sportGenres: draft.genre,
              contractDuration: draft.contract,
              minExperience: "",
              minAge: draft.minAge ? parseInt(draft.minAge, 10) : null,
              maxAge: draft.maxAge ? parseInt(draft.maxAge, 10) : null,
              euPassport: "No",
              availabilityToTravel: "No",
              extras: draft.extras,
              requirements: [],
            },
            ...current,
          ]);
          setOverlay(null);
          setTab("panel");
        }}
      />
    );
  } else if (overlay === "candidates" && myOffers.some((o) => o.id === activeOfferId)) {
    content = (
      <CandidatesScreen
        offer={myOffers.find((o) => o.id === activeOfferId) as MyOffer}
        offerDetail={
          allOffers.find((o) => o.id === activeOfferId) ??
          allOffers.find((o) => o.title === myOffers.find((m) => m.id === activeOfferId)?.title) ??
          null
        }
        canRequestRepresentation={user.role === "agency"}
        onOpenPlayer={openCandidate}
        onToggle={toggleCandidate}
        onRequestRepresentation={(playerId) =>
          setPortfolio((c) => (c.some((e) => e.playerId === playerId) ? c : [...c, { playerId, status: "pending" }]))
        }
        onOpenOffer={(offer) => {
          setOverlay(null);
          setSelectedOffer(offer);
        }}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "portfolio" && user.role === "agency") {
    content = (
      <PortfolioScreen
        offers={allOffers}
        portfolio={portfolio}
        applications={agencyApps}
        onRequest={(playerId) =>
          setPortfolio((c) => (c.some((e) => e.playerId === playerId) ? c : [...c, { playerId, status: "pending" }]))
        }
        onRemove={(playerId) => {
          setPortfolio((c) => c.filter((e) => e.playerId !== playerId));
        }}
        onApply={(playerId, offerId) =>
          setAgencyApps((c) =>
            c.length >= MONTHLY_CREDITS || c.some((a) => a.playerId === playerId && a.offerId === offerId)
              ? c
              : [...c, { playerId, offerId }],
          )
        }
        onOpenPlayer={setSelectedPlayer}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "match") {
    content = <MatchScreen onOpenPlayer={setSelectedPlayer} onBack={() => setOverlay(null)} />;
  } else if (overlay === "folders") {
    content = (
      <FoldersScreen
        folders={folders}
        onCreate={createFolder}
        onRemovePlayer={removeFromFolder}
        onOpenPlayer={setSelectedPlayer}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "edit") {
    content = (
      <EditProfileScreen
        name={user.name}
        role={user.role}
        profile={profile}
        onBack={() => setOverlay(null)}
        onSave={(name, next) => {
          setUser({ ...user, name });
          setProfile(next);
          setOverlay(null);
        }}
      />
    );
  } else if (overlay === "success") {
    content = <SuccessCasesScreen onBack={() => setOverlay(null)} />;
  } else if (overlay === "help") {
    content = <HelpScreen onBack={() => setOverlay("settings")} />;
  } else if (overlay === "applications") {
    content = (
      <MyApplicationsScreen
        offers={allOffers.filter((o) => appliedIds.includes(o.id))}
        statuses={appStatuses}
        onOpenOffer={setSelectedOffer}
        onSearchOffers={() => {
          setOverlay(null);
          changeTab("mercado");
        }}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "notifications") {
    content = (
      <NotificationsScreen
        items={notifications.filter((n) => n.audience === myAudience)}
        onMarkAllRead={() =>
          setNotifications((c) => c.map((n) => (n.audience === myAudience ? { ...n, read: true } : n)))
        }
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "pages") {
    content = (
      <OrgPagesScreen
        pages={pages}
        onOpen={(page) => {
          setActivePageId(page.id);
          setOverlay("pageDetail");
        }}
        onCreate={() => {
          setEditingPage(false);
          setOverlay("pageForm");
        }}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "pageForm") {
    const current = pages.find((p) => p.id === activePageId) ?? null;
    content = (
      <OrgFormScreen
        page={editingPage ? current : null}
        onBack={() => setOverlay(editingPage ? "pageDetail" : "pages")}
        onSubmit={(data) => {
          if (editingPage && current) {
            // Si la rechazaron, al volver a guardarla pasa de nuevo a revisión.
            const status = current.status === "REJECTED" ? "PENDING_REVIEW" : current.status;
            setPages((c) => c.map((p) => (p.id === current.id ? { ...p, ...data, status, rejectionReason: undefined } : p)));
            setOverlay("pageDetail");
          } else {
            const created: OrgPage = { ...EMPTY_ORG, ...data, id: "org" + (pages.length + 1) + "-" + Date.now(), status: "APPROVED" };
            setPages((c) => [...c, created]);
            setActivePageId(created.id);
            setOverlay("pageDetail");
          }
        }}
      />
    );
  } else if (overlay === "pageDetail" && pages.some((p) => p.id === activePageId)) {
    const page = pages.find((p) => p.id === activePageId) as OrgPage;
    content = (
      <OrgPageScreen
        page={page}
        portfolioPlayerIds={portfolio.filter((e) => e.status === "active").map((e) => e.playerId)}
        onEdit={() => {
          setEditingPage(true);
          setOverlay("pageForm");
        }}
        onBack={() => setOverlay("pages")}
      />
    );
  } else if (overlay === "plan") {
    content = <PlanScreen role={user.role} plans={plans} onChange={setPlans} onBack={() => setOverlay("settings")} />;
  } else if (overlay === "verification") {
    content = (
      <VerificationScreen
        role={user.role}
        name={user.name}
        profile={profile}
        status={verification}
        onAddPhoto={() => setProfile((p) => ({ ...p, hasPhoto: true }))}
        onEditProfile={() => setOverlay("edit")}
        onRequest={() => setVerification("pending")}
        onSimulateApproval={() => setVerification("verified")}
        onBack={() => setOverlay("settings")}
      />
    );
  } else if (overlay === "settings") {
    content = (
      <SettingsScreen
        email={user.email}
        prefs={prefs}
        onPrefsChange={setPrefs}
        verification={verification}
        onOpenPlan={() => setOverlay("plan")}
        onOpenHelp={() => setOverlay("help")}
        onOpenVerification={() => setOverlay("verification")}
        onLogout={logout}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (selectedOffer) {
    content = (
      <OfertaScreen
        offer={selectedOffer}
        applied={appliedIds.includes(selectedOffer.id)}
        onBack={() => setSelectedOffer(null)}
        onApply={() => apply(selectedOffer.id)}
      />
    );
  } else if (tab === "inicio") {
    content = (
      <HomeScreen
        offers={allOffers}
        user={user}
        profile={profile}
        plans={plans}
        appliedIds={appliedIds}
        myOffers={myOffers}
        notifications={notifications}
        verified={verification === "verified"}
        representedCount={portfolio.filter((e) => e.status === "active").length}
        creditsLeft={MONTHLY_CREDITS - agencyApps.length}
        onOpenOffer={setSelectedOffer}
        onSearchOffers={() => changeTab("mercado")}
        onEditProfile={() => setOverlay("edit")}
        onOpenPlan={() => setOverlay("plan")}
        onOpenNotifications={() => setOverlay("notifications")}
        onOpenApplications={() => setOverlay("applications")}
        onOpenSuccess={() => setOverlay("success")}
        appStatuses={appStatuses}
        onOpenMyOffer={openOfferCandidates}
        onPublish={() => setOverlay("publish")}
      />
    );
  } else if (tab === "mercado") {
    content = (
      <ExploreScreen
        offers={allOffers}
        appliedIds={appliedIds}
        savedIds={savedIds}
        onOpenOffer={setSelectedOffer}
        onApply={apply}
        onToggleSave={toggleSave}
      />
    );
  } else if (tab === "panel" && user.role !== "player") {
    content = (
      <PanelScreen
        offers={myOffers}
        folders={folders}
        onPublish={() => setOverlay("publish")}
        onOpenOffer={openOfferCandidates}
        onOpenFolders={() => setOverlay("folders")}
        onOpenMatch={() => setOverlay("match")}
        portfolioCount={user.role === "agency" ? portfolio.filter((e) => e.status === "active").length : undefined}
        onOpenPortfolio={user.role === "agency" ? () => setOverlay("portfolio") : undefined}
      />
    );
  } else if (tab === "buscar") {
    content = (
      <BuscarScreen
        savedIds={savedPlayerIds}
        onOpenPlayer={setSelectedPlayer}
        onToggleSave={toggleSavePlayer}
      />
    );
  } else {
    content = (
      <PerfilScreen
        user={user}
        profile={profile}
        appliedCount={appliedIds.length}
        onEdit={() => setOverlay("edit")}
        onSettings={() => setOverlay("settings")}
        verified={verification === "verified"}
        onVerify={() => setOverlay("verification")}
        onOpenPages={user.role !== "player" ? () => setOverlay("pages") : undefined}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top"]}>
          {!selectedOffer && !selectedPlayer && !overlay && tab !== "perfil" && (
            <TopBar
              initials={initials}
              onAvatar={() => changeTab("perfil")}
              onSearch={() => changeTab("buscar")}
              onMessages={() => {
                setSelectedOffer(null);
                setSelectedPlayer(null);
                setOverlay("messages");
              }}
              unreadCount={threads.filter((th) => th.unread).length}
              onNotifications={() => {
                setSelectedOffer(null);
                setSelectedPlayer(null);
                setOverlay("notifications");
              }}
              notificationCount={notifications.filter((n) => n.audience === myAudience && !n.read).length}
            />
          )}
          {content}
        </SafeAreaView>
        <TabBar active={tab} onChange={changeTab} showPanel={user.role !== "player"} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
});
