import { Offer, Profile } from "./data";

// Puesto de registro del staff → rol del catálogo de ofertas.
export const PUESTO_TO_ROLE: Record<string, string> = {
  coach: "Entrenador",
  technicalDirector: "Director Deportivo",
  sportingDirector: "Director Deportivo",
  scout: "Ojeador Scout",
  talentScout: "Ojeador Scout",
  goalkeeperCoach: "Entrenador de Porteros",
  fitnessCoach: "Preparador Físico",
  analyst: "Analista",
  physiotherapist: "Fisioterapeuta",
  nutritionist: "Nutricionista",
  psychologist: "Psicólogo",
};

export type Reason = "position" | "secondaryPosition" | "country" | "recent";

export type ForYouItem = { offer: Offer; score: number; reasons: Reason[] };

// País de residencia: lo que va después de la última coma ("Roma, Italia" → "Italia").
export function residenceCountry(profile: Profile): string {
  const parts = profile.location.split(",").map((p) => p.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
}

const norm = (v: string) => v.trim().toLowerCase();
const WEEK_HOURS = 24 * 7;

// "Para vos": ordena las ofertas por afinidad con el perfil (posición, posición
// alternativa, país y novedad), como el feed de la web.
export function forYou(
  offers: Offer[],
  ownPosition: string,
  secondaryPosition: string,
  country: string,
): { items: ForYouItem[]; fallback: boolean } {
  const scored: ForYouItem[] = offers.map((offer) => {
    const reasons: Reason[] = [];
    let score = 0;
    if (ownPosition && offer.positions.includes(ownPosition)) {
      reasons.push("position");
      score += 50;
    } else if (secondaryPosition && offer.positions.includes(secondaryPosition)) {
      reasons.push("secondaryPosition");
      score += 25;
    }
    if (country && norm(offer.country) === norm(country)) {
      reasons.push("country");
      score += 20;
    }
    if (offer.postedHoursAgo < WEEK_HOURS) {
      reasons.push("recent");
      score += 10;
    }
    return { offer, score, reasons };
  });

  const matches = scored
    .filter((s) => s.reasons.includes("position") || s.reasons.includes("secondaryPosition"))
    .sort((a, b) => b.score - a.score || a.offer.postedHoursAgo - b.offer.postedHoursAgo);
  if (matches.length > 0) return { items: matches, fallback: false };

  // Sin ofertas para su posición: lo último de su país.
  const latest = scored
    .filter((s) => s.reasons.includes("country"))
    .sort((a, b) => a.offer.postedHoursAgo - b.offer.postedHoursAgo);
  return { items: latest, fallback: true };
}

// ---------- Alertas de ofertas
export type JobAlert = {
  id: string;
  kind: "AUTO" | "CUSTOM";
  position: string;
  country: string | null; // null = cualquier país
};

export const MAX_CUSTOM_ALERTS = 3;

// Ofertas nuevas (última semana) que encajan con una alerta.
export function newThisWeek(alert: JobAlert, offers: Offer[]): number {
  return offers.filter(
    (o) =>
      o.postedHoursAgo < WEEK_HOURS &&
      o.positions.includes(alert.position) &&
      (!alert.country || norm(o.country) === norm(alert.country)),
  ).length;
}
