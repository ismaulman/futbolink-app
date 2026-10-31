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
  INITIAL_PORTFOLIO,
  MONTHLY_CREDITS,
  PortfolioEntry,
  INITIAL_MY_OFFERS,
  INITIAL_PREFS,
  INITIAL_PROFILE,
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
import PortfolioScreen from "./src/screens/PortfolioScreen";
import PanelScreen from "./src/screens/PanelScreen";
import PublishOfferScreen from "./src/screens/PublishOfferScreen";
import MercadoScreen from "./src/screens/MercadoScreen";
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
  const [tab, setTab] = useState<TabKey>("mercado");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [savedPlayerIds, setSavedPlayerIds] = useState<string[]>([]);
  const [proposalIds, setProposalIds] = useState<string[]>([]);
  const [overlay, setOverlay] = useState<
    "edit" | "settings" | "messages" | "publish" | "candidates" | "folders" | "portfolio" | "match" | null
  >(null);
  const [myOffers, setMyOffers] = useState<MyOffer[]>(INITIAL_MY_OFFERS);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
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
          <AuthScreen onSubmit={setUser} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
        onSendProposal={() =>
          setProposalIds((c) => (c.includes(selectedPlayer.id) ? c : [...c, selectedPlayer.id]))
        }
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
          setMyOffers((current) => [
            {
              id: `mo${Date.now()}`,
              type: draft.type,
              title: draft.title.trim() || fallback,
              status: "PENDING",
              postedHoursAgo: 0,
              candidates: [],
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
        onOpenPlayer={openCandidate}
        onToggle={toggleCandidate}
        onBack={() => setOverlay(null)}
      />
    );
  } else if (overlay === "portfolio" && user.role === "agency") {
    content = (
      <PortfolioScreen
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
  } else if (overlay === "settings") {
    content = (
      <SettingsScreen
        email={user.email}
        prefs={prefs}
        onPrefsChange={setPrefs}
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
  } else if (tab === "mercado") {
    content = (
      <MercadoScreen
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
        onOpenOffer={(offer) => {
          setActiveOfferId(offer.id);
          setOverlay("candidates");
        }}
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
