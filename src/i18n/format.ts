import { TFunction } from "i18next";

// "Hace 2 horas" / "Hace 3 días", traducido.
export function timeAgo(t: TFunction, hours: number): string {
  if (hours < 24) return t("time.hoursAgo", { count: Math.max(1, hours) });
  return t("time.daysAgo", { count: Math.round(hours / 24) });
}
