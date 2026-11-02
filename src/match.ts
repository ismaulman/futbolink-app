import { MOCK_PLAYERS, Offer, Player } from "./data";

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

export const EU_COUNTRIES = [
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

// Compatibilidad de un postulante con la oferta (misma lógica que utils/offerMatch.ts
// de la web): pesos fijos, los criterios sin datos no penalizan y la experiencia
// funciona como techo. Devuelve null si no se puede evaluar.
export type OfferCriterion = "primary" | "experience" | "secondary" | "euPassport" | "age";
const OFFER_WEIGHTS: Record<OfferCriterion, number> = {
  primary: 35,
  experience: 35,
  secondary: 5,
  euPassport: 8,
  age: 8,
};

export function offerMatch(player: Player, offer: Offer | null): number | null {
  if (!offer || offer.positions.length === 0) return null;
  const scores: Partial<Record<OfferCriterion, number>> = {};

  const primary = offer.positions.includes(player.position);
  const secondary = player.secondaryPosition ? offer.positions.includes(player.secondaryPosition) : false;
  // Una posición totalmente incompatible deja el match en 0%.
  if (!primary && !secondary) return 0;
  scores.primary = primary ? 100 : 0;
  scores.secondary = secondary ? 100 : 0;

  const required = (offer.minExperience || offer.category) as keyof typeof CATEGORY_RANK;
  if (CATEGORY_RANK[required]) {
    const gap = CATEGORY_RANK[required] - CATEGORY_RANK[player.category];
    scores.experience = gap <= 0 ? 100 : gap === 1 ? 50 : 0;
  }
  if (offer.euPassport === "Si") scores.euPassport = EU_COUNTRIES.includes(player.country) ? 100 : 0;
  if (offer.minAge !== null || offer.maxAge !== null) {
    const okMin = offer.minAge === null || player.age >= offer.minAge;
    const okMax = offer.maxAge === null || player.age <= offer.maxAge;
    scores.age = okMin && okMax ? 100 : 0;
  }

  let weight = 0;
  let points = 0;
  for (const key of Object.keys(scores) as OfferCriterion[]) {
    weight += OFFER_WEIGHTS[key];
    points += ((scores[key] as number) / 100) * OFFER_WEIGHTS[key];
  }
  const weighted = weight > 0 ? Math.round((points / weight) * 100) : 0;
  const cap = scores.experience === undefined ? 100 : Math.min(100, Math.round(50 + scores.experience * 0.5));
  return Math.min(100, weighted, cap);
}
