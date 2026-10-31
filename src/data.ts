// Datos de ejemplo. Más adelante esto se reemplaza por la API real.

// Mismos tipos de registro que la web: Futbolista, Cuerpo técnico (staff, que
// después se divide en puestos) y Agente / Representante (agencia).
export type Role = "player" | "staff" | "agency";

// Los textos de cada rol están en src/i18n/locales (role.<key>.label / .desc).
export const ROLE_KEYS: Role[] = ["player", "staff", "agency"];

// Puestos del registro (mismos que la web). Los textos: puesto.<id>.
export const STAFF_PUESTOS = [
  "coach",
  "technicalDirector",
  "sportingDirector",
  "scout",
  "goalkeeperCoach",
  "fitnessCoach",
  "analyst",
  "physiotherapist",
  "nutritionist",
  "psychologist",
  "talentScout",
];
export const AGENCY_PUESTOS = ["fifaAgent", "representative"];

export type User = {
  name: string;
  email: string;
  role: Role;
  // id de STAFF_PUESTOS / AGENCY_PUESTOS, o el texto libre si eligió "Otro".
  puesto?: string;
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

// ---------- Mensajes y propuestas (forma alineada con message-thread.entity.ts)
export type ThreadKind = "SYSTEM" | "PROPOSAL" | "PLAYER_PROP" | "OFFER_SHARE";
export type ThreadStatus = "OPEN" | "ACCEPTED" | "REJECTED" | "EXPIRED";

export type ChatMessage = {
  id: string;
  fromMe: boolean;
  body?: string; // texto escrito por una persona
  bodyKey?: string; // texto del sistema (se traduce)
  hoursAgo: number;
};

export type Thread = {
  id: string;
  kind: ThreadKind;
  subject?: string;
  subjectKey?: string;
  withName: string; // la otra parte
  status: ThreadStatus;
  unread: boolean;
  iAmRecipient: boolean; // true: me escribieron; false: yo envié
  hoursAgo: number; // último mensaje
  messages: ChatMessage[];
};

export const MOCK_THREADS: Thread[] = [
  {
    id: "t1",
    kind: "PROPOSAL",
    subject: "Propuesta: Delantero Centro – Eccellenza",
    withName: "ASD Bari Nord",
    status: "OPEN",
    unread: true,
    iAmRecipient: true,
    hoursAgo: 3,
    messages: [
      {
        id: "t1m1",
        fromMe: false,
        body: "Hola, vimos tu perfil y nos interesa que seas parte del plantel para la próxima temporada. Ofrecemos €800 mensuales y alojamiento.",
        hoursAgo: 3,
      },
    ],
  },
  {
    id: "t2",
    kind: "SYSTEM",
    subjectKey: "sys.welcomeSubject",
    withName: "FutboLink",
    status: "OPEN",
    unread: true,
    iAmRecipient: true,
    hoursAgo: 30,
    messages: [{ id: "t2m1", fromMe: false, bodyKey: "sys.welcomeBody", hoursAgo: 30 }],
  },
  {
    id: "t3",
    kind: "OFFER_SHARE",
    subject: "Oferta compartida: Preparador Físico – Prima Categoria",
    withName: "Marco Bellini",
    status: "OPEN",
    unread: false,
    iAmRecipient: true,
    hoursAgo: 50,
    messages: [
      {
        id: "t3m1",
        fromMe: false,
        body: "Te comparto esta oferta, creo que puede interesarte.",
        hoursAgo: 50,
      },
    ],
  },
  {
    id: "t4",
    kind: "PROPOSAL",
    subject: "Propuesta: Lateral Izquierdo – Promozione",
    withName: "Pro Etna",
    status: "ACCEPTED",
    unread: false,
    iAmRecipient: true,
    hoursAgo: 120,
    messages: [
      { id: "t4m1", fromMe: false, body: "Te ofrecemos sumarte al plantel de Promozione.", hoursAgo: 140 },
      { id: "t4m2", fromMe: true, body: "Acepto, muchas gracias.", hoursAgo: 125 },
      { id: "t4m3", fromMe: false, body: "Perfecto, te escribimos con los detalles.", hoursAgo: 120 },
    ],
  },
  {
    id: "t5",
    kind: "PLAYER_PROP",
    subject: "Propuesta: Mediocampista Central – Liga 2",
    withName: "CS Dinamic",
    status: "OPEN",
    unread: false,
    iAmRecipient: false,
    hoursAgo: 72,
    messages: [
      {
        id: "t5m1",
        fromMe: true,
        body: "Hola, soy mediocampista y me interesa la oferta de Liga 2. Les dejo mi perfil.",
        hoursAgo: 72,
      },
    ],
  },
];

// ---------- Herramientas de ofertante
// Roles de Staff del catálogo de la plataforma (job-offer.catalog.ts).
export const STAFF_ROLES = [
  "Entrenador",
  "Entrenador de Porteros",
  "Preparador Físico",
  "Director Deportivo",
  "Ojeador Scout",
  "Analista",
  "Fisioterapeuta",
  "Médico",
  "Nutricionista",
  "Psicólogo",
  "Coordinador",
  "Jefe de Reclutamiento",
  "Utillero",
  "Árbitro",
  "Representante",
  "Periodista",
  "Marketing Digital",
  "Administrativo",
];

export const SPORT_GENRES = ["Masculino", "Femenino", "Ambos", "Indistinto"];
export const CATEGORIES = ["Amateur", "Semiprofesional", "Profesional"];
export const EXTRAS = [
  "Alojamiento",
  "Vuelos",
  "Transporte",
  "Auto",
  "Gimnasio",
  "Viáticos",
  "Comida",
  "Premios por rendimiento",
];
export const CURRENCIES = ["€", "US$", "£"];

// ACTIVE: visible en el Mercado. PENDING: en revisión antes de publicarse.
export type MyOfferStatus = "ACTIVE" | "PENDING" | "CLOSED";

export type Candidate = {
  playerId: string;
  hoursAgo: number;
  viewed: boolean;
  interested: boolean; // "Me interesa"
  shortlisted: boolean; // candidato preseleccionado dentro de esta oferta
};

export type MyOffer = {
  id: string;
  type: OfferType;
  title: string;
  status: MyOfferStatus;
  postedHoursAgo: number;
  candidates: Candidate[];
};

export const INITIAL_MY_OFFERS: MyOffer[] = [
  {
    id: "mo1",
    type: "player",
    title: "Delantero Centro – Eccellenza",
    status: "ACTIVE",
    postedHoursAgo: 96,
    candidates: [
      { playerId: "p1", hoursAgo: 5, viewed: false, interested: false, shortlisted: false },
      { playerId: "p5", hoursAgo: 20, viewed: false, interested: false, shortlisted: false },
      { playerId: "p2", hoursAgo: 40, viewed: true, interested: true, shortlisted: false },
    ],
  },
  {
    id: "mo2",
    type: "player",
    title: "Portero – Promozione",
    status: "ACTIVE",
    postedHoursAgo: 170,
    candidates: [
      { playerId: "p4", hoursAgo: 60, viewed: true, interested: false, shortlisted: true },
    ],
  },
];

export type Folder = { id: string; name: string; playerIds: string[] };

export const INITIAL_FOLDERS: Folder[] = [
  { id: "f1", name: "Delanteros", playerIds: ["p1"] },
  { id: "f2", name: "Para ver en vivo", playerIds: [] },
];

// Portafolio de la agencia: jugadores que representa (o que ya les pidió representación).
export type PortfolioEntry = { playerId: string; status: "active" | "pending" };

export const INITIAL_PORTFOLIO: PortfolioEntry[] = [
  { playerId: "p1", status: "active" },
  { playerId: "p2", status: "active" },
  { playerId: "p3", status: "pending" },
];

// Créditos de postulación por mes (cada postulación en nombre de un jugador gasta 1).
export const MONTHLY_CREDITS = 10;

// Postulación hecha por la agencia en nombre de un jugador.
export type AgencyApplication = { playerId: string; offerId: string };
