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
  INITIAL_PREFS,
  INITIAL_PROFILE,
  MOCK_THREADS,
  NotificationPrefs,
  Offer,
  Player,
  Profile,
  Thread,
  User,
} from "./src/data";
import AuthScreen from "./src/screens/AuthScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import MessagesScreen from "./src/screens/MessagesScreen";
import ThreadScreen from "./src/screens/ThreadScreen";
import BuscarScreen from "./src/screens/BuscarScreen";
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
  const [overlay, setOverlay] = useState<"edit" | "settings" | "messages" | null>(null);
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

  const changeTab = (next: TabKey) => {
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
  if (overlay === "messages" && openThreadData) {
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
  } else if (selectedPlayer) {
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
        onBack={() => setSelectedPlayer(null)}
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
        <TabBar active={tab} onChange={changeTab} />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1 },
});
