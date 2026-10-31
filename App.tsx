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
import { Offer, User } from "./src/data";
import AuthScreen from "./src/screens/AuthScreen";
import BuscarScreen from "./src/screens/BuscarScreen";
import MercadoScreen from "./src/screens/MercadoScreen";
import OfertaScreen from "./src/screens/OfertaScreen";
import PerfilScreen from "./src/screens/PerfilScreen";
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

  const apply = (offerId: string) => {
    setAppliedIds((current) =>
      current.includes(offerId) ? current : [...current, offerId],
    );
  };

  const changeTab = (next: TabKey) => {
    setSelectedOffer(null);
    setTab(next);
  };

  const logout = () => {
    setUser(null);
    setTab("mercado");
    setSelectedOffer(null);
    setAppliedIds([]);
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
  if (selectedOffer) {
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
        appliedCount={appliedIds.length}
        onLogout={logout}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={styles.root}>
        <SafeAreaView style={styles.content} edges={["top"]}>
          {!selectedOffer && tab !== "perfil" && (
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
