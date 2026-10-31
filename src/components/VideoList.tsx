import { Ionicons } from "@expo/vector-icons";
import { Image, Linking, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { parseVideo } from "../video";
import { COLORS, RADIUS } from "../theme";

type Props = { urls: string[]; onRemove?: (url: string) => void };

// Videos del perfil: miniatura de YouTube con botón de play; al tocar abre el video.
export default function VideoList({ urls, onRemove }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.list}>
      {urls.map((raw) => {
        const video = parseVideo(raw);
        if (!video) return null;
        return (
          <View key={raw} style={styles.item}>
            <Pressable
              onPress={() => Linking.openURL(video.url)}
              accessibilityLabel={t("video.watch")}
              style={styles.thumbBox}
            >
              <Image source={{ uri: video.thumbnail }} style={styles.thumb} resizeMode="cover" />
              <View style={styles.play}>
                <Ionicons name="play" size={22} color={COLORS.white} />
              </View>
            </Pressable>
            {onRemove && (
              <Pressable
                onPress={() => onRemove(raw)}
                hitSlop={8}
                accessibilityLabel={t("video.remove")}
                style={styles.remove}
              >
                <Ionicons name="close-circle" size={24} color={COLORS.ink} />
              </Pressable>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12 },
  item: { position: "relative" },
  thumbBox: {
    aspectRatio: 16 / 9,
    borderRadius: RADIUS.md,
    overflow: "hidden",
    backgroundColor: COLORS.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: { ...StyleSheet.absoluteFillObject },
  play: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.pill,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  remove: { position: "absolute", top: 6, right: 6, backgroundColor: COLORS.white, borderRadius: RADIUS.pill },
});
