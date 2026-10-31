import { StyleSheet, View } from "react-native";
import { COLORS } from "../theme";

// Posición en el campo (x: izquierda→derecha, y: ataque→arco propio).
const SPOTS: Record<string, { x: number; y: number }> = {
  Portero: { x: 0.5, y: 0.93 },
  "Lateral Izquierdo": { x: 0.15, y: 0.72 },
  "Defensor Central Izquierdo": { x: 0.38, y: 0.78 },
  "Defensor Central Derecho": { x: 0.62, y: 0.78 },
  "Lateral Derecho": { x: 0.85, y: 0.72 },
  "Mediocampista Defensivo": { x: 0.5, y: 0.62 },
  "Mediocampista Central": { x: 0.5, y: 0.5 },
  "Mediocampista Derecho": { x: 0.82, y: 0.48 },
  "Mediocampista Ofensivo": { x: 0.5, y: 0.36 },
  "Extremo Izquierdo": { x: 0.15, y: 0.2 },
  "Delantero Centro": { x: 0.5, y: 0.14 },
  "Extremo Derecho": { x: 0.85, y: 0.2 },
};

const W = 112;
const H = 156;
const LINE = "#d1d5db";

// Resplandor suave: varios círculos concentrales con opacidad decreciente
// (funciona igual en web, iOS y Android, sin depender de sombras).
const GLOW = [
  { size: 46, opacity: 0.05 },
  { size: 38, opacity: 0.07 },
  { size: 30, opacity: 0.1 },
  { size: 23, opacity: 0.14 },
  { size: 17, opacity: 0.2 },
];

type Props = { position: string; secondary?: string };

export default function PositionPitch({ position, secondary }: Props) {
  const main = SPOTS[position];
  const second = secondary ? SPOTS[secondary] : undefined;

  return (
    <View style={styles.pitch}>
      {/* línea de medio campo y círculo */}
      <View style={styles.centerCircle} />
      {/* área grande y chica (abajo, arco propio) */}
      <View style={styles.bigBox} />
      <View style={styles.smallBox} />

      {second && (
        <View
          style={[
            styles.secondary,
            { left: second.x * W - 5, top: second.y * H - 5 },
          ]}
        />
      )}

      {main &&
        GLOW.map((ring) => (
          <View
            key={ring.size}
            style={{
              position: "absolute",
              left: main.x * W - ring.size / 2,
              top: main.y * H - ring.size / 2,
              width: ring.size,
              height: ring.size,
              borderRadius: ring.size / 2,
              backgroundColor: COLORS.primary,
              opacity: ring.opacity,
            }}
          />
        ))}
      {main && (
        <View
          style={[styles.dot, { left: main.x * W - 6, top: main.y * H - 6 }]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pitch: {
    width: W,
    height: H,
    borderWidth: 1.5,
    borderColor: LINE,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    overflow: "hidden",
  },
  centerCircle: {
    position: "absolute",
    top: -22,
    left: W / 2 - 22,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: LINE,
  },
  bigBox: {
    position: "absolute",
    bottom: -1.5,
    left: W * 0.2,
    width: W * 0.6,
    height: H * 0.26,
    borderWidth: 1.5,
    borderColor: LINE,
  },
  smallBox: {
    position: "absolute",
    bottom: -1.5,
    left: W * 0.36,
    width: W * 0.28,
    height: H * 0.1,
    borderWidth: 1.5,
    borderColor: LINE,
  },
  dot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  secondary: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
});
