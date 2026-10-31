// Datos de ejemplo de Fichajes y Noticias. Más adelante vienen de la API
// (/fichajes y /news de la plataforma).

export type SigningType = "TRASPASO" | "CESION" | "LIBRE";

export type Signing = {
  id: string;
  playerName: string;
  position: string; // del catálogo de posiciones
  age: number;
  fromClub: string | null; // null = agente libre
  toClub: string;
  flag: string;
  toCountry: string;
  type: SigningType;
  date: string; // AAAA-MM-DD
  agency?: string;
  views: number;
};

export const MOCK_SIGNINGS: Signing[] = [
  { id: "s1", playerName: "Matías Ferreyra", position: "Delantero Centro", age: 24, fromClub: "Club Atlético Sarmiento", toClub: "ASD Bari Nord", flag: "🇮🇹", toCountry: "Italia", type: "TRASPASO", date: "2026-10-28", agency: "Sports Link", views: 412 },
  { id: "s2", playerName: "Lucas Benítez", position: "Mediocampista Central", age: 21, fromClub: "Defensores Unidos", toClub: "CD Alcoyano B", flag: "🇪🇸", toCountry: "España", type: "CESION", date: "2026-10-25", views: 268 },
  { id: "s3", playerName: "Nicolás Paredes", position: "Portero", age: 29, fromClub: null, toClub: "FC Săgeata", flag: "🇷🇴", toCountry: "Rumania", type: "LIBRE", date: "2026-10-22", agency: "Pro Rep", views: 190 },
  { id: "s4", playerName: "Joaquín Aranda", position: "Lateral Derecho", age: 23, fromClub: "Racing de Olavarría", toClub: "Cerro Largo FC", flag: "🇺🇾", toCountry: "Uruguay", type: "TRASPASO", date: "2026-10-18", views: 321 },
  { id: "s5", playerName: "Tomás Villalba", position: "Extremo Izquierdo", age: 20, fromClub: "Juventud Unida", toClub: "ASD Pescara Nord", flag: "🇮🇹", toCountry: "Italia", type: "CESION", date: "2026-10-12", agency: "Sports Link", views: 154 },
  { id: "s6", playerName: "Ezequiel Montoya", position: "Defensor Central Derecho", age: 27, fromClub: null, toClub: "Perth United SC", flag: "🇦🇺", toCountry: "Australia", type: "LIBRE", date: "2026-10-05", views: 233 },
];

export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  date: string;
  body: string[];
};

export const NEWS_CATEGORIES = [
  "Mercado",
  "Transferencias",
  "Oportunidades",
  "Fútbol",
  "FutboLink",
  "Internacional",
] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const MOCK_NEWS: NewsItem[] = [
  {
    id: "n1",
    title: "Cómo armar un perfil que los clubes quieran abrir",
    summary: "Foto, posición, video y trayectoria: lo que mira un reclutador en los primeros segundos.",
    category: "FutboLink",
    date: "2026-10-29",
    body: [
      "Un perfil completo se abre más. Cargá una foto clara, tu posición principal y, si podés, un video de tus mejores jugadas.",
      "La trayectoria ordenada, con club, años y categoría, ayuda a que el reclutador entienda tu nivel sin tener que preguntar.",
    ],
  },
  {
    id: "n2",
    title: "Ventana de pases: qué mercados abren primero",
    summary: "Italia y España concentran la mayor cantidad de ofertas abiertas este mes.",
    category: "Mercado",
    date: "2026-10-26",
    body: [
      "Las categorías semiprofesionales de Italia y España publican la mayor cantidad de ofertas al inicio de la ventana.",
      "Si buscás oportunidades en Europa, conviene tener el pasaporte al día y el perfil verificado.",
    ],
  },
  {
    id: "n3",
    title: "Tres cesiones que movieron el mercado esta semana",
    summary: "Jugadores jóvenes que salen a ganar minutos en divisiones inferiores.",
    category: "Transferencias",
    date: "2026-10-22",
    body: [
      "Las cesiones siguen siendo el camino más usado para que los juveniles sumen minutos.",
      "Mirá la sección Fichajes para ver todos los movimientos confirmados por las dos partes.",
    ],
  },
  {
    id: "n4",
    title: "Ofertas para porteros: por qué hay tanta demanda",
    summary: "Los clubes de ascenso buscan porteros con experiencia y pasaporte europeo.",
    category: "Oportunidades",
    date: "2026-10-15",
    body: [
      "La posición de portero es una de las que más ofertas abiertas tiene en relación con los perfiles disponibles.",
      "Si sos portero, destacá tus partidos jugados y cualquier video de atajadas en tu perfil.",
    ],
  },
];
