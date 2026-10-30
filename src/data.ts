// Datos de ejemplo. Más adelante esto se reemplaza por la API real.

// Mismos tipos de cuenta que la plataforma: Futbolista, Staff, Agencia,
// Reclutador y Club (los últimos tres son "ofertantes").
export type Role = "player" | "staff" | "agency" | "recruiter" | "club";

export const ROLES: { key: Role; label: string; description: string }[] = [
  { key: "player", label: "Futbolista", description: "Busco club u oportunidades" },
  { key: "staff", label: "Staff", description: "Entrenador, preparador, analista…" },
  { key: "agency", label: "Agencia", description: "Represento o busco talento" },
  { key: "recruiter", label: "Reclutador", description: "Busco talento para clubes" },
  { key: "club", label: "Club", description: "Publico oportunidades y busco fichajes" },
];

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
  posted: string;
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
    posted: "Hace 2 horas",
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
    posted: "Hace 5 horas",
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
    posted: "Ayer",
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
    posted: "Hace 2 días",
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
    posted: "Hace 3 días",
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
  },
];

export const MY_PROFILE = {
  name: "Ismael Ulman",
  position: "Mediocampista Central",
  flag: "🇦🇷",
  country: "Argentina",
  verified: true,
  views: 1284,
  videoPlays: 342,
  height: "1,78 m",
  foot: "Derecho",
  club: "Sin club (agente libre)",
  career: [
    { year: "2024 – 2025", club: "Club Deportivo Norte", detail: "Liga regional" },
    { year: "2022 – 2024", club: "Atlético Juvenil", detail: "Categoría Reserva" },
    { year: "2020 – 2022", club: "Academia FutboLink", detail: "Formativas" },
  ],
};
