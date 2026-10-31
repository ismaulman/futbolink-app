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
import TabBar, { TabKey } from "./src/components/TabBar";
import TopBar from "./src/components/TopBar";
import {
  INITIAL_PREFS,
  INITIAL_PROFILE,
  NotificationPrefs,
  Offer,
  Profile,
  User,
} from "./src/data";
import AuthScreen from "./src/screens/AuthScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import BuscarScreen from "./src/screens/BuscarScreen";
import MercadoScreen from "./src/screens/MercadoScreen";
import OfertaScreen from "./src/screens/OfertaScreen";
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
  const [overlay, setOverlay] = useState<"edit" | "settings" | null>(null);
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [prefs, setPrefs] = useState<NotificationPrefs>(INITIAL_PREFS);

  const apply = (offerId: string) => {
    setAppliedIds((current) =>
      current.includes(offerId) ? current : [...current, offerId],
    );
  };

  const changeTab = (next: TabKey) => {
    setSelectedOffer(null);
    setOverlay(null);
    setTab(next);
  };

  const logout = () => {
    setUser(null);
    setTab("mercado");
    setSelectedOffer(null);
    setAppliedIds([]);
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

  let content;
  if (overlay === "edit") {
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
        onOpenOffer={setSelectedOffer}
        onApply={apply}
      />
    );
  } else if (tab === "buscar") {
    content = <BuscarScreen />;
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
          {!selectedOffer && !overlay && tab !== "perfil" && (
            <TopBar
              initials={initials}
              onAvatar={() => changeTab("perfil")}
              onSearch={() => changeTab("buscar")}
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
