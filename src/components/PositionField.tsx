import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Text from "./AppText";
import { COLORS, RADIUS } from "../theme";

// Posiciones sobre la cancha (x, y en %), con sigla y zona, igual que la web.
const SPOTS: Record<string, { x: number; y: number; zone: Zone; abbr: string }> = {
  Portero: { x: 50, y: 95, zone: "gk", abbr: "PT" },
  "Defensor Central Izquierdo": { x: 35, y: 80, zone: "defense", abbr: "DCI" },
  "Defensor Central Derecho": { x: 65, y: 80, zone: "defense", abbr: "DCD" },
  "Lateral Derecho": { x: 85, y: 80, zone: "defense", abbr: "LD" },
  "Lateral Izquierdo": { x: 15, y: 80, zone: "defense", abbr: "LI" },
  "Mediocampista Defensivo": { x: 50, y: 65, zone: "midfield", abbr: "MCD" },
  "Mediocampista Izquierdo": { x: 35, y: 50, zone: "midfield", abbr: "MI" },
  "Mediocampista Central": { x: 50, y: 50, zone: "midfield", abbr: "MC" },
  "Mediocampista Derecho": { x: 65, y: 50, zone: "midfield", abbr: "MD" },
  "Mediocampista Ofensivo": { x: 50, y: 35, zone: "midfield", abbr: "MCO" },
  "Extremo Derecho": { x: 85, y: 35, zone: "attack", abbr: "ED" },
  "Extremo Izquierdo": { x: 15, y: 35, zone: "attack", abbr: "EI" },
  "Delantero Centro": { x: 50, y: 15, zone: "attack", abbr: "DC" },
};

type Zone = "gk" | "defense" | "midfield" | "attack";
const ZONES: Zone[] = ["gk", "defense", "midfield", "attack"];
const ZONE_KEY: Record<Zone, string> = {
  gk: "field.zoneGk",
  defense: "field.zoneDefense",
  midfield: "field.zoneMidfield",
  attack: "field.zoneAttack",
};

const BLUE = "#2563eb";
const GREEN_DARK = "#15803d";
const PITCH_W = 260;
const PITCH_H = 346; // 3:4
const native = Platform.OS !== "web";

// Un punto de la cancha: aparece con un "pop" al elegirse y late con un aro suave.
function Dot({
  abbr,
  kind,
  top,
  left,
  onPress,
  label,
}: {
  abbr: string;
  kind: "primary" | "secondary" | null;
  top: number;
  left: number;
  onPress: () => void;
  label: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!kind) {
      scale.setValue(1);
      pulse.setValue(0);
      return;
    }
    scale.setValue(0.5);
    Animated.spring(scale, { toValue: kind === "primary" ? 1.15 : 1.1, friction: 4, tension: 160, useNativeDriver: native }).start();
    const loop = Animated.loop(
      Animated.timing(pulse, { toValue: 1, duration: kind === "primary" ? 1800 : 2200, easing: Easing.out(Easing.quad), useNativeDriver: native }),
    );
    pulse.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [kind, scale, pulse]);

  const color = kind === "secondary" ? BLUE : COLORS.primary;
  return (
    <View style={[styles.dotWrap, { top: `${top}%`, left: `${left}%` }]} pointerEvents="box-none">
      {kind && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              backgroundColor: color,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
              transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }],
            },
          ]}
        />
      )}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Pressable
          onPress={onPress}
          accessibilityLabel={label}
          accessibilityState={{ selected: !!kind }}
          style={[
            styles.dot,
            kind === "primary" && { backgroundColor: COLORS.primary },
            kind === "secondary" && { borderColor: BLUE },
          ]}
        >
          <Text style={[styles.dotText, kind === "primary" && { color: "#fff" }, kind === "secondary" && { color: "#1d4ed8" }]}>
            {abbr}
          </Text>
          {kind && (
            <View style={[styles.badge, { backgroundColor: kind === "primary" ? GREEN_DARK : BLUE }]}>
              <Text style={styles.badgeText}>{kind === "primary" ? "1" : "2"}</Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    </View>
  );
}

type Props = {
  primary: string;
  secondary: string;
  onPrimary: (position: string) => void;
  onSecondary: (position: string) => void;
};

// Selector de posiciones sobre la cancha, como el de la web (principal y secundaria).
export default function PositionField({ primary, secondary, onPrimary, onSecondary }: Props) {
  const { t } = useTranslation();
  const tc = (v: string) => t(`catalog.${v}`);
  const [mode, setMode] = useState<"primary" | "secondary">("primary");

  const choose = (name: string) => {
    if (mode === "primary") {
      onPrimary(name);
      if (!secondary) setMode("secondary");
    } else {
      onSecondary(name);
    }
  };

  const kindOf = (name: string): "primary" | "secondary" | null =>
    primary === name ? "primary" : secondary === name ? "secondary" : null;

  const isPrimaryMode = mode === "primary";

  return (
    <View>
      <Text style={styles.heading}>{t("field.select")}</Text>

      <View style={styles.pitch}>
        {Array.from({ length: 8 }, (_, i) => (
          <View key={i} style={{ height: PITCH_H / 8, backgroundColor: i % 2 === 0 ? "#34a853" : "#2e9a4a" }} />
        ))}
        {/* líneas del campo */}
        <View style={styles.midLine} />
        <View style={styles.circle} />
        <View style={[styles.box, styles.boxTop, { height: "17%", width: "56%" }]} />
        <View style={[styles.box, styles.boxTop, { height: "8%", width: "28%" }]} />
        <View style={[styles.box, styles.boxBottom, { height: "17%", width: "56%" }]} />
        <View style={[styles.box, styles.boxBottom, { height: "8%", width: "28%" }]} />

        {Object.entries(SPOTS).map(([name, s]) => (
          <Dot
            key={name}
            abbr={s.abbr}
            kind={kindOf(name)}
            left={s.x}
            top={6 + s.y * 0.88}
            label={tc(name)}
            onPress={() => choose(name)}
          />
        ))}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]}>
            <Text style={styles.legendDotText}>1</Text>
          </View>
          <Text style={styles.legendText}>{t("field.primary")}</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#fff", borderWidth: 2, borderColor: BLUE }]}>
            <Text style={[styles.legendDotText, { color: "#1d4ed8" }]}>2</Text>
          </View>
          <Text style={styles.legendText}>{t("field.secondary")}</Text>
        </View>
      </View>

      <View style={styles.modes}>
        <Pressable onPress={() => setMode("primary")} style={[styles.mode, isPrimaryMode && { backgroundColor: COLORS.primary }]}>
          <Ionicons name="football-outline" size={14} color={isPrimaryMode ? "#fff" : COLORS.muted} />
          <Text style={[styles.modeText, isPrimaryMode && styles.modeTextOn]}>{t("field.primary")}</Text>
        </Pressable>
        <Pressable onPress={() => setMode("secondary")} style={[styles.mode, !isPrimaryMode && { backgroundColor: BLUE }]}>
          <Ionicons name="radio-button-off-outline" size={14} color={!isPrimaryMode ? "#fff" : COLORS.muted} />
          <Text style={[styles.modeText, !isPrimaryMode && styles.modeTextOn]}>{t("field.secondary")}</Text>
        </Pressable>
      </View>

      <View style={styles.summary}>
        <View style={[styles.sumCard, { borderColor: isPrimaryMode ? COLORS.primary : COLORS.primaryBorder, backgroundColor: COLORS.primarySoft }]}>
          <Text style={[styles.sumLabel, { color: COLORS.primaryDark }]}>1 · {t("field.primary")}</Text>
          <Text style={primary ? styles.sumValue : styles.sumEmpty} numberOfLines={1}>
            {primary ? tc(primary) : t("field.notChosen")}
          </Text>
        </View>
        <View style={[styles.sumCard, { borderColor: !isPrimaryMode ? BLUE : "#bfdbfe", backgroundColor: "#eff6ff" }]}>
          <Text style={[styles.sumLabel, { color: "#1d4ed8" }]}>2 · {t("field.secondary")}</Text>
          <Text style={secondary ? styles.sumValue : styles.sumEmpty} numberOfLines={1}>
            {secondary ? tc(secondary) : t("field.notChosen")}
          </Text>
        </View>
      </View>
      {!!secondary && (
        <Pressable onPress={() => onSecondary("")} hitSlop={8}>
          <Text style={styles.clear}>{t("field.clearSecondary")}</Text>
        </Pressable>
      )}

      <Text style={styles.tip}>{t("field.tip")}</Text>

      <Text style={styles.byName}>{t("field.byName")}</Text>
      {ZONES.map((zone) => (
        <View key={zone} style={styles.zone}>
          <Text style={styles.zoneLabel}>{t(ZONE_KEY[zone])}</Text>
          <View style={styles.chips}>
            {Object.entries(SPOTS)
              .filter(([, s]) => s.zone === zone)
              .map(([name]) => {
                const kind = kindOf(name);
                return (
                  <Pressable
                    key={name}
                    onPress={() => choose(name)}
                    style={[
                      styles.chip,
                      kind === "primary" && { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
                      kind === "secondary" && { borderColor: BLUE },
                    ]}
                  >
                    {kind && <Ionicons name="checkmark-circle" size={14} color={kind === "primary" ? "#fff" : BLUE} />}
                    <Text style={[styles.chipText, kind === "primary" && { color: "#fff" }, kind === "secondary" && { color: "#1d4ed8" }]}>
                      {tc(name)}
                    </Text>
                  </Pressable>
                );
              })}
          </View>
        </View>
      ))}
    </View>
  );
}

const LINE = "rgba(255,255,255,0.9)";

const styles = StyleSheet.create({
  heading: { fontSize: 15, fontWeight: "500", color: COLORS.ink, marginBottom: 12 },
  pitch: {
    width: PITCH_W,
    height: PITCH_H,
    alignSelf: "center",
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
    position: "relative",
  },
  midLine: { position: "absolute", left: 0, right: 0, top: "50%", height: 1, backgroundColor: LINE },
  circle: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 56,
    height: 56,
    marginLeft: -28,
    marginTop: -28,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: LINE,
  },
  box: { position: "absolute", left: "50%", borderWidth: 1, borderColor: LINE },
  boxTop: { top: 0, borderTopWidth: 0, transform: [{ translateX: -PITCH_W * 0.28 }] },
  boxBottom: { bottom: 0, borderBottomWidth: 0, transform: [{ translateX: -PITCH_W * 0.28 }] },
  dotWrap: { position: "absolute", width: 34, height: 34, marginLeft: -17, marginTop: -17, alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", width: 34, height: 34, borderRadius: 17 },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: { fontSize: 10, fontWeight: "600", color: "#374151" },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 9, fontWeight: "600", color: "#fff" },
  legend: { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 10 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 16, height: 16, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  legendDotText: { fontSize: 9, fontWeight: "600", color: "#fff" },
  legendText: { fontSize: 11, color: COLORS.muted },
  modes: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.divider,
  },
  mode: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 9, borderRadius: RADIUS.sm },
  modeText: { fontSize: 13, color: COLORS.muted, fontWeight: "500" },
  modeTextOn: { color: "#fff" },
  summary: { flexDirection: "row", gap: 8, marginTop: 10 },
  sumCard: { flex: 1, borderWidth: 1.5, borderRadius: RADIUS.md, padding: 10 },
  sumLabel: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
  sumValue: { fontSize: 14, fontWeight: "500", color: COLORS.ink },
  sumEmpty: { fontSize: 14, color: COLORS.subtle },
  clear: { fontSize: 12, color: COLORS.muted, marginTop: 8, textDecorationLine: "underline" },
  tip: { fontSize: 12, lineHeight: 18, color: COLORS.muted, marginTop: 10 },
  byName: { fontSize: 12, fontWeight: "600", color: COLORS.ink, marginTop: 18, marginBottom: 8 },
  zone: { marginBottom: 10 },
  zoneLabel: { fontSize: 10, fontWeight: "600", color: COLORS.subtle, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
  },
  chipText: { fontSize: 12, fontWeight: "500", color: COLORS.muted },
});
