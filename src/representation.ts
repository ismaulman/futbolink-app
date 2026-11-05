import { VisibilityPlan } from "./data";

// Representación: el jugador pide que una agencia/agente lo represente (o recibe una invitación).
export type RepStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type RepRequest = {
  id: string;
  agentId: string;
  status: RepStatus;
  byPlayer: boolean; // true: la pidió el jugador; false: invitación de la agencia
  daysAgo: number;
  message?: string;
};

export type Agent = {
  id: string;
  name: string;
  kind: "agency" | "agent";
  country: string;
  flag: string;
};

export const MOCK_AGENTS: Agent[] = [
  { id: "ag1", name: "Gol Sports Management", kind: "agency", country: "Italia", flag: "🇮🇹" },
  { id: "ag2", name: "Sur Talent Agency", kind: "agency", country: "Argentina", flag: "🇦🇷" },
  { id: "ag3", name: "Marcos Ferreira", kind: "agent", country: "Portugal", flag: "🇵🇹" },
  { id: "ag4", name: "Iberia Football Partners", kind: "agency", country: "España", flag: "🇪🇸" },
  { id: "ag5", name: "Lucía Benítez", kind: "agent", country: "Uruguay", flag: "🇺🇾" },
];

export const INITIAL_REP_REQUESTS: RepRequest[] = [
  { id: "r1", agentId: "ag2", status: "PENDING", byPlayer: false, daysAgo: 1 },
  { id: "r2", agentId: "ag4", status: "REJECTED", byPlayer: true, daysAgo: 20 },
];

// Cupo mensual de solicitudes según el plan de visibilidad (Amateur 3 · Semi 5 · Pro 10).
export const QUOTA_BY_PLAN: Record<VisibilityPlan, number> = {
  free: 0,
  amateur: 3,
  semiprofesional: 5,
  profesional: 10,
};

export const REJECTION_COOLDOWN_DAYS = 90;
export const MONTH_DAYS = 30;

export function quotaOf(plan: VisibilityPlan, requests: RepRequest[]) {
  const limit = QUOTA_BY_PLAN[plan];
  const used = requests.filter((r) => r.byPlayer && r.daysAgo < MONTH_DAYS).length;
  return { limit, used, remaining: Math.max(0, limit - used) };
}

// Días que faltan para poder volver a escribirle a quien rechazó (0 = ya se puede).
export function cooldownLeft(requests: RepRequest[], agentId: string): number {
  const rejected = requests
    .filter((r) => r.agentId === agentId && r.status === "REJECTED" && r.byPlayer)
    .sort((a, b) => a.daysAgo - b.daysAgo)[0];
  return rejected ? Math.max(0, REJECTION_COOLDOWN_DAYS - rejected.daysAgo) : 0;
}
