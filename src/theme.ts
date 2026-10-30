// Tokens de diseño de FutboLink (ver claude/diseno-app-movil.md en el proyecto).
// Regla: cero hex sueltos en las pantallas; todo sale de acá.
export const COLORS = {
  primary: "#16a34a", // botón lleno de acción (uno por pantalla)
  primaryDark: "#15803d", // texto, links e íconos verdes sobre blanco
  primarySoft: "#f0fdf4", // chips activos, fondo de íconos, avisos
  primaryBorder: "#bbf7d0",
  brand: "#3e7b26", // verde del logo: login y registro
  ink: "#10241a", // títulos y texto fuerte (nunca negro puro)
  muted: "#5c6b60", // texto secundario
  subtle: "#9ca3af", // placeholders, íconos inactivos
  border: "#e5e7eb",
  divider: "#f3f4f6",
  surface: "#f9fafb", // inputs y chips inactivos
  background: "#ffffff",
  white: "#ffffff",
  warning: "#f59e0b",
  danger: "#dc2626",
};

export const RADIUS = {
  sm: 8, // botones e inputs
  md: 12, // tarjetas
  pill: 999, // chips
};
