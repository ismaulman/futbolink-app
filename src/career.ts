// Trayectoria del perfil (mismos campos que la web: club, país, liga, fechas, categoría).
export type CareerEntry = {
  id: string;
  club: string;
  country: string;
  league: string;
  start: string; // "MM/AAAA"
  end: string; // "MM/AAAA"; vacío = actualidad
  category: string;
};

export const CATEGORIES = [
  "Primera",
  "Reserva",
  "Primera Local",
  "U23",
  "U22",
  "U21",
  "U20",
  "U19",
  "U18",
  "U17",
  "U16",
  "U15",
  "U14",
];

export const EMPTY_CAREER: Omit<CareerEntry, "id"> = {
  club: "",
  country: "",
  league: "",
  start: "",
  end: "",
  category: "Primera",
};

const MONTH_YEAR = /^(0[1-9]|1[0-2])\/(\d{4})$/;

// Convierte "MM/AAAA" en un número comparable (año*12+mes) o null si no es válido.
export function monthValue(value: string): number | null {
  const m = MONTH_YEAR.exec(value.trim());
  return m ? Number(m[2]) * 12 + Number(m[1]) : null;
}

export type CareerError = "club" | "start" | "end" | "order";

export function validateCareer(entry: Omit<CareerEntry, "id">): CareerError | null {
  if (entry.club.trim().length < 2) return "club";
  const s = monthValue(entry.start);
  if (s === null) return "start";
  if (entry.end.trim() !== "") {
    const e = monthValue(entry.end);
    if (e === null) return "end";
    if (e < s) return "order";
  }
  return null;
}

// Más reciente primero; la experiencia actual (sin fecha de fin) va arriba.
export function sortCareer(list: CareerEntry[]): CareerEntry[] {
  return [...list].sort((a, b) => {
    const aCur = a.end.trim() === "";
    const bCur = b.end.trim() === "";
    if (aCur !== bCur) return aCur ? -1 : 1;
    return (monthValue(b.start) ?? 0) - (monthValue(a.start) ?? 0);
  });
}

export function currentClub(list: CareerEntry[]): string {
  return sortCareer(list).find((c) => c.end.trim() === "")?.club ?? "";
}
