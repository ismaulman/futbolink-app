import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "../components/AppText";
import { Offer, Profile, User } from "../data";
import { JobAlert } from "../forYou";
import { COLORS } from "../theme";
import FichajesScreen from "./FichajesScreen";
import MercadoScreen from "./MercadoScreen";
import NoticiasScreen from "./NoticiasScreen";
import PaisesScreen from "./PaisesScreen";

type Section = "offers" | "signings" | "countries" | "news";
const SECTIONS: Section[] = ["offers", "signings", "countries", "news"];

type Props = {
  offers: Offer[];
  appliedIds: string[];
  savedIds: string[];
  onOpenOffer: (offer: Offer) => void;
  onApply: (offerId: string) => void;
  onToggleSave: (offerId: string) => void;
  user: User;
  profile: Profile;
  customAlerts: JobAlert[];
  onAlertsChange: (alerts: JobAlert[]) => void;
  onEditProfile: () => void;
};

// Pestaña Mercado: ofertas, fichajes, mercado por país y noticias.
export default function ExploreScreen(props: Props) {
  const { t } = useTranslation();
  const [section, setSection] = useState<Section>("offers");

  return (
    <View style={styles.screen}>
      <View style={styles.bar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.barContent}>
          {SECTIONS.map((key) => {
            const active = section === key;
            return (
              <Pressable key={key} onPress={() => setSection(key)} style={styles.item}>
                <Text style={[styles.itemText, active && styles.itemTextActive]}>{t(`explore.${key}`)}</Text>
                <View style={[styles.underline, active && styles.underlineActive]} />
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      {section === "offers" && <MercadoScreen {...props} />}
      {section === "signings" && <FichajesScreen />}
      {section === "countries" && <PaisesScreen offers={props.offers} onOpenOffer={props.onOpenOffer} />}
      {section === "news" && <NoticiasScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.background },
  bar: { borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  barContent: { paddingHorizontal: 16, gap: 20 },
  item: { paddingTop: 10 },
  itemText: { fontSize: 14, color: COLORS.muted, paddingBottom: 8 },
  itemTextActive: { color: COLORS.ink, fontWeight: "500" },
  underline: { height: 2, backgroundColor: "transparent" },
  underlineActive: { backgroundColor: COLORS.primary },
});
