import { MOCK_PLAYERS, Player } from "./data";

// Mismo esquema que Recruit Match de la plataforma (back/.../recruit-match):
// puntaje 0-100 por dimensiones con pesos fijos. Solo se calculan las que los
// jugadores de ejemplo tienen cargadas; disponibilidad, mercados y salario
// llegan cuando se conecte la API.
export type DimensionKey = "position" | "citizenship" | "experience" | "age";
export type DimensionStatus = "match" | "partial" | "miss";

export const MATCH_WEIGHTS: Record<DimensionKey, number> = {
  position: 30,
  citizenship: 20,
  experience: 25,
  age: 10,
};

export type MatchCriteria = {
  position: string;
  minAge?: number;
  maxAge?: number;
  euPassport: boolean;
  category: "" | "Amateur" | "Semiprofesional" | "Profesional";
};

export type MatchResult = {
  player: Player;
  score: number;
  breakdown: { key: DimensionKey; status: DimensionStatus }[];
};

const EU_COUNTRIES = [
  "Italia", "España", "Francia", "Alemania", "Portugal", "Rumania", "Grecia",
  "Países Bajos", "Bélgica", "Croacia", "Polonia", "Austria", "Irlanda",
];
const CATEGORY_RANK = { Amateur: 1, Semiprofesional: 2, Profesional: 3 } as const;
const RATIO: Record<DimensionStatus, number> = { match: 1, partial: 0.5, miss: 0 };

function evaluate(player: Player, c: MatchCriteria): MatchResult {
  const position: DimensionStatus =
    player.position === c.position ? "match" : player.secondaryPosition === c.position ? "partial" : "miss";

  const citizenship: DimensionStatus =
    !c.euPassport || EU_COUNTRIES.includes(player.country) ? "match" : "miss";

  let experience: DimensionStatus = "match";
  if (c.category) {
    const gap = CATEGORY_RANK[c.category] - CATEGORY_RANK[player.category];
    experience = gap <= 0 ? "match" : gap === 1 ? "partial" : "miss";
  }

  let age: DimensionStatus = "match";
  if (c.minAge !== undefined && player.age < c.minAge) age = c.minAge - player.age <= 2 ? "partial" : "miss";
  if (c.maxAge !== undefined && player.age > c.maxAge) age = player.age - c.maxAge <= 2 ? "partial" : "miss";

  const breakdown = [
    { key: "position" as const, status: position },
    { key: "citizenship" as const, status: citizenship },
    { key: "experience" as const, status: experience },
    { key: "age" as const, status: age },
  ];
  const score = Math.round(
    breakdown.reduce((sum, d) => sum + MATCH_WEIGHTS[d.key] * RATIO[d.status], 0),
  );
  return { player, score, breakdown };
}

// Ordena (no bloquea): el que mejor encaja, primero.
export function runMatch(criteria: MatchCriteria): MatchResult[] {
  return MOCK_PLAYERS.map((p) => evaluate(p, criteria)).sort((a, b) => b.score - a.score);
}
