// Datos de ejemplo. Más adelante esto se reemplaza por la API real.

// Mismos tipos de cuenta que la plataforma: Futbolista, Staff, Agencia,
// Reclutador y Club (los últimos tres son "ofertantes").
export type Role = "player" | "staff" | "agency" | "recruiter" | "club";

// Los textos de cada rol están en src/i18n/locales (role.<key>.label / .desc).
export const ROLE_KEYS: Role[] = ["player", "staff", "agency", "recruiter", "club"];

export type User = {
  name: string;
  email: string;
  role: Role;
};

export type OfferType = "player" | "staff";

// Campos alineados con la entidad Jobs de la plataforma (back/.../jobs.entity.ts).
export type Offer = {
  id: string;
  type: OfferType;
  flag: string;
  country: string;
  region: string; // location
  club: string; // organización que publica
  league: string;
  title: string;
  salary: string; // incluye moneda, ej. "€800 / mes"
  postedHoursAgo: number; // se muestra con t("time.hoursAgo/daysAgo")
  description: string;
  positions: string[]; // posiciones o roles buscados
  category: string; // Amateur / Semiprofesional / Profesional
  sportGenres: string; // Masculino / Femenino / Ambos / Indistinto
  contractDuration: string; // ej. "Temporada completa"
  minExperience: string;
  minAge: number | null;
  maxAge: number | null;
  euPassport: "Si" | "No";
  availabilityToTravel: "Si" | "No";
  extras: string[]; // beneficios (Alojamiento, Vuelos, ...)
  requirements: string[]; // competencias requeridas
};

export const MOCK_OFFERS: Offer[] = [
  {
    id: "1",
    type: "player",
    flag: "🇮🇹",
    country: "Italia",
    region: "Bari, Puglia",
    club: "ASD Bari Nord",
    league: "Eccellenza",
    title: "Delantero Centro – Eccellenza",
    salary: "€800 / mes",
    postedHoursAgo: 2,
    description:
      "Club de Eccellenza busca delantero centro con buen juego de espaldas y definición. Temporada completa con posibilidad de renovación.",
    positions: ["Delantero Centro"],
    category: "Semiprofesional",
    sportGenres: "Masculino",
    contractDuration: "Temporada completa",
    minExperience: "Semiprofesional",
    minAge: 18,
    maxAge: 30,
    euPassport: "Si",
    availabilityToTravel: "Si",
    extras: ["Alojamiento", "Transporte", "Premios por rendimiento"],
    requirements: ["Juego de espaldas", "Definición", "Trabajo en equipo"],
  },
  {
    id: "2",
    type: "player",
    flag: "🇮🇹",
    country: "Italia",
    region: "Catania, Sicilia",
    club: "Pro Etna",
    league: "Promozione",
    title: "Portero – Promozione",
    salary: "€600 / mes",
    postedHoursAgo: 5,
    description:
      "Buscamos portero con buen juego de pies y liderazgo para la defensa. Entrenamientos de martes a jueves.",
    positions: ["Portero"],
    category: "Amateur",
    sportGenres: "Masculino",
    contractDuration: "Temporada completa",
    minExperience: "Amateur",
    minAge: 19,
    maxAge: 35,
    euPassport: "No",
    availabilityToTravel: "No",
    extras: ["Comida", "Gimnasio"],
    requirements: ["Juego de pies", "Liderazgo", "Comunicación"],
  },
  {
    id: "3",
    type: "staff",
    flag: "🇦🇺",
    country: "Australia",
    region: "Melbourne, Victoria",
    club: "Marden Sports FC",
    league: "NPL Victoria",
    title: "Entrenador – Primer equipo",
    salary: "AUD 3.500 / mes",
    postedHoursAgo: 24,
    description:
      "El club busca entrenador para su primer equipo masculino con licencia vigente y experiencia en fútbol formativo y competitivo.",
    positions: ["Entrenador"],
    category: "Profesional",
    sportGenres: "Masculino",
    contractDuration: "2 temporadas",
    minExperience: "Profesional",
    minAge: 28,
    maxAge: null,
    euPassport: "No",
    availabilityToTravel: "Si",
    extras: ["Alojamiento", "Vuelos", "Auto"],
    requirements: ["Licencia de entrenador", "Inglés intermedio", "Análisis de video"],
  },
  {
    id: "4",
    type: "player",
    flag: "🇷🇴",
    country: "Rumania",
    region: "Cluj-Napoca",
    club: "CS Dinamic",
    league: "Liga 2",
    title: "Mediocampista Central – Liga 2",
    salary: "€1.200 / mes",
    postedHoursAgo: 48,
    description:
      "Mediocampista con visión de juego y buen pase para un equipo que busca el ascenso.",
    positions: ["Mediocampista Central", "Mediocampista Defensivo"],
    category: "Profesional",
    sportGenres: "Masculino",
    contractDuration: "1 año",
    minExperience: "Profesional",
    minAge: 20,
    maxAge: 32,
    euPassport: "Si",
    availabilityToTravel: "Si",
    extras: ["Alojamiento", "Comida", "Premios por rendimiento"],
    requirements: ["Visión de juego", "Buen pase", "Intensidad"],
  },
  {
    id: "5",
    type: "staff",
    flag: "🇮🇹",
    country: "Italia",
    region: "Verona, Véneto",
    club: "Polisportiva Verona Sud",
    league: "Prima Categoria",
    title: "Preparador Físico – Prima Categoria",
    salary: "€700 / mes",
    postedHoursAgo: 72,
    description:
      "Buscamos preparador físico para planificar la carga de entrenamiento y la prevención de lesiones del plantel.",
    positions: ["Preparador Físico"],
    category: "Amateur",
    sportGenres: "Indistinto",
    contractDuration: "Temporada completa",
    minExperience: "Amateur",
    minAge: 23,
    maxAge: null,
    euPassport: "Si",
    availabilityToTravel: "No",
    extras: ["Transporte", "Viáticos"],
    requirements: ["Título en educación física", "Planificación", "Prevención de lesiones"],
  },
];

export type Player = {
  id: string;
  name: string;
  age: number;
  position: string; // una de las 12 posiciones del catálogo real
  secondaryPosition?: string;
  foot: "Derecho" | "Izquierdo" | "Ambos";
  height: string;
  category: "Amateur" | "Semiprofesional" | "Profesional";
  flag: string;
  country: string;
  club: string;
  verified: boolean;
  weightKg: number;
  views: number;
  videos: number;
  career: { years: string; club: string; detail: string }[];
};

// Posiciones del catálogo de la plataforma (job-offer.catalog.ts).
export const POSITIONS = [
  "Todas",
  "Portero",
  "Lateral Izquierdo",
  "Defensor Central Izquierdo",
  "Defensor Central Derecho",
  "Lateral Derecho",
  "Mediocampista Defensivo",
  "Mediocampista Central",
  "Mediocampista Derecho",
  "Mediocampista Ofensivo",
  "Extremo Izquierdo",
  "Delantero Centro",
  "Extremo Derecho",
];

export const MOCK_PLAYERS: Player[] = [
  {
    id: "p1",
    name: "Lucas Fernández",
    age: 22,
    position: "Delantero Centro",
    secondaryPosition: "Extremo Derecho",
    foot: "Derecho",
    height: "1,82 m",
    category: "Semiprofesional",
    flag: "🇦🇷",
    country: "Argentina",
    club: "Club Atlético Sur",
    verified: true,
    weightKg: 76,
    views: 420,
    videos: 3,
    career: [
      { years: "2024 – hoy", club: "Club Atlético Sur", detail: "Primera local" },
      { years: "2021 – 2024", club: "Juventud Norte", detail: "Reserva" },
    ],
  },
  {
    id: "p2",
    name: "Matteo Rossi",
    age: 24,
    position: "Mediocampista Central",
    secondaryPosition: "Mediocampista Defensivo",
    foot: "Ambos",
    height: "1,79 m",
    category: "Profesional",
    flag: "🇮🇹",
    country: "Italia",
    club: "ASD Napoli Est",
    verified: true,
    weightKg: 73,
    views: 980,
    videos: 5,
    career: [
      { years: "2023 – hoy", club: "ASD Napoli Est", detail: "Serie D" },
      { years: "2020 – 2023", club: "US Salerno Giovani", detail: "Primavera" },
    ],
  },
  {
    id: "p3",
    name: "Diego Ramírez",
    age: 27,
    position: "Defensor Central Derecho",
    secondaryPosition: "Lateral Derecho",
    foot: "Derecho",
    height: "1,85 m",
    category: "Profesional",
    flag: "🇪🇸",
    country: "España",
    club: "CD Valencia B",
    verified: false,
    weightKg: 82,
    views: 310,
    videos: 2,
    career: [
      { years: "2022 – hoy", club: "CD Valencia B", detail: "Segunda RFEF" },
      { years: "2018 – 2022", club: "Levante Cantera", detail: "Juvenil A" },
    ],
  },
  {
    id: "p4",
    name: "Andrei Popescu",
    age: 20,
    position: "Portero",
    foot: "Derecho",
    height: "1,90 m",
    category: "Semiprofesional",
    flag: "🇷🇴",
    country: "Rumania",
    club: "CS Dinamic",
    verified: false,
    weightKg: 84,
    views: 150,
    videos: 1,
    career: [
      { years: "2024 – hoy", club: "CS Dinamic", detail: "Liga 2" },
      { years: "2021 – 2024", club: "Academia Cluj", detail: "Sub-19" },
    ],
  },
  {
    id: "p5",
    name: "Tomás Peralta",
    age: 19,
    position: "Extremo Izquierdo",
    foot: "Izquierdo",
    height: "1,74 m",
    category: "Amateur",
    flag: "🇺🇾",
    country: "Uruguay",
    club: "Juventud Unida",
    verified: false,
    weightKg: 68,
    views: 95,
    videos: 2,
    career: [
      { years: "2024 – hoy", club: "Juventud Unida", detail: "Liga amateur" },
    ],
  },
  {
    id: "p6",
    name: "Gabriele Conti",
    age: 26,
    position: "Lateral Izquierdo",
    foot: "Izquierdo",
    height: "1,77 m",
    category: "Semiprofesional",
    flag: "🇮🇹",
    country: "Italia",
    club: "Pro Etna",
    verified: true,
    weightKg: 71,
    views: 540,
    videos: 4,
    career: [
      { years: "2023 – hoy", club: "Pro Etna", detail: "Promozione" },
      { years: "2021 – 2023", club: "Catania Youth", detail: "Under 19" },
    ],
  },
];

// Datos editables del perfil (mismos campos que la entidad User de la plataforma).
export type Profile = {
  nationality: string;
  location: string;
  position: string; // primaryPosition
  secondaryPosition: string; // "" = ninguna
  foot: string; // skillfulFoot: Derecho / Izquierdo / Ambos
  heightCm: string;
  weightKg: string;
};

export const INITIAL_PROFILE: Profile = {
  nationality: "Argentina",
  location: "Roma, Italia",
  position: "Mediocampista Central",
  secondaryPosition: "Mediocampista Defensivo",
  foot: "Derecho",
  heightCm: "178",
  weightKg: "72",
};

// Preferencias de notificación (PATCH /user/:id/notification-preferences).
export type NotificationPrefs = {
  emailNotifyJobMatches: boolean;
  emailNotifyTalentAlerts: boolean;
};

export const INITIAL_PREFS: NotificationPrefs = {
  emailNotifyJobMatches: true,
  emailNotifyTalentAlerts: true,
};

// Datos de ejemplo del perfil (estadísticas y trayectoria).
export const MY_PROFILE = {
  verified: true,
  views: 1284,
  videoPlays: 342,
  club: "", // vacío = sin club (se muestra profile.noClub)
  career: [
    { year: "2024 – 2025", club: "Club Deportivo Norte", detail: "Liga regional" },
    { year: "2022 – 2024", club: "Atlético Juvenil", detail: "Categoría Reserva" },
    { year: "2020 – 2022", club: "Academia FutboLink", detail: "Formativas" },
  ],
};
