// Datos de ejemplo. Más adelante esto se reemplaza por la API real.

export type Role = "player" | "staff" | "agency";

export const ROLES: { key: Role; label: string; description: string }[] = [
  { key: "player", label: "Jugador", description: "Busco club u oportunidades" },
  { key: "staff", label: "Staff", description: "Entrenador, preparador, analista…" },
  { key: "agency", label: "Agencia", description: "Represento o busco talento" },
];

export type User = {
  name: string;
  email: string;
  role: Role;
};

export type OfferType = "player" | "staff";

export type Offer = {
  id: string;
  type: OfferType;
  flag: string;
  country: string;
  region: string;
  club: string;
  league: string;
  title: string;
  salary: string;
  posted: string;
  description: string;
  requirements: string[];
  benefits: string[];
};

export const MOCK_OFFERS: Offer[] = [
  {
    id: "1",
    type: "player",
    flag: "🇮🇹",
    country: "Italia",
    region: "Puglia",
    club: "ASD Bari Nord",
    league: "Eccellenza",
    title: "Delantero Centro – Eccellenza",
    salary: "€800",
    posted: "Publicada hace 2 horas",
    description:
      "Club de Eccellenza busca delantero centro con buen juego de espaldas y definición. Temporada completa con posibilidad de renovación.",
    requirements: [
      "Mayor de 18 años",
      "Pasaporte comunitario o permiso de residencia",
      "Experiencia en categorías semiprofesionales",
    ],
    benefits: ["Alojamiento", "Salario mensual", "Seguro deportivo"],
  },
  {
    id: "2",
    type: "player",
    flag: "🇮🇹",
    country: "Italia",
    region: "Sicilia",
    club: "Pro Etna",
    league: "Promozione",
    title: "Portero – Promozione",
    salary: "Da concordare",
    posted: "Publicada hace 1 día",
    description:
      "Buscamos portero con buena salida de balón para sumarse a la plantilla desde la próxima semana.",
    requirements: ["Disponibilidad inmediata", "Altura mínima 1,85 m"],
    benefits: ["Comidas incluidas", "Equipamiento del club"],
  },
  {
    id: "3",
    type: "staff",
    flag: "🇦🇺",
    country: "Australia",
    region: "Marden",
    club: "Marden Sports FC",
    league: "Liga amateur",
    title: "Head Coach – Australia",
    salary: "Negociable",
    posted: "Publicada hace 3 días",
    description:
      "Club amateur busca entrenador principal para dirigir al primer equipo y coordinar las categorías juveniles.",
    requirements: [
      "Licencia de entrenador vigente",
      "Inglés fluido",
      "Experiencia dirigiendo equipos adultos",
    ],
    benefits: ["Visa de trabajo asistida", "Alojamiento los primeros meses"],
  },
  {
    id: "4",
    type: "player",
    flag: "🇷🇴",
    country: "Rumania",
    region: "Bucarest",
    club: "CS Dinamic",
    league: "Liga 2",
    title: "Mediocampista Central – Liga 2",
    salary: "Negociable",
    posted: "Publicada hace 3 días",
    description:
      "Equipo de Liga 2 busca mediocampista central con lectura de juego y buen pase corto.",
    requirements: ["Experiencia profesional", "Pasaporte de la UE"],
    benefits: ["Salario mensual", "Vivienda"],
  },
  {
    id: "5",
    type: "staff",
    flag: "🇮🇹",
    country: "Italia",
    region: "Veneto",
    club: "Polisportiva Verona Sud",
    league: "Prima Categoria",
    title: "Preparador físico – Prima Categoria",
    salary: "€600",
    posted: "Publicada hace 5 días",
    description:
      "Buscamos preparador físico para trabajar con el primer equipo, con enfoque en prevención de lesiones.",
    requirements: ["Título en ciencias del deporte", "Disponibilidad vespertina"],
    benefits: ["Contrato anual", "Posibilidad de crecimiento en el club"],
  },
];

export type Player = {
  id: string;
  name: string;
  age: number;
  position: string;
  flag: string;
  country: string;
  club: string;
  verified: boolean;
};

export const POSITIONS = [
  "Todas",
  "Portero",
  "Defensor",
  "Mediocampista",
  "Delantero",
];

export const MOCK_PLAYERS: Player[] = [
  {
    id: "p1",
    name: "Lucas Fernández",
    age: 22,
    position: "Delantero",
    flag: "🇦🇷",
    country: "Argentina",
    club: "Club Atlético Sur",
    verified: true,
  },
  {
    id: "p2",
    name: "Matteo Rossi",
    age: 24,
    position: "Mediocampista",
    flag: "🇮🇹",
    country: "Italia",
    club: "ASD Napoli Est",
    verified: true,
  },
  {
    id: "p3",
    name: "Diego Ramírez",
    age: 27,
    position: "Defensor",
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
    flag: "🇷🇴",
    country: "Rumania",
    club: "CS Dinamic",
    verified: false,
  },
  {
    id: "p5",
    name: "Thiago Souza",
    age: 25,
    position: "Delantero",
    flag: "🇧🇷",
    country: "Brasil",
    club: "EC Vitória Jr",
    verified: true,
  },
  {
    id: "p6",
    name: "Nicolás Pereyra",
    age: 23,
    position: "Mediocampista",
    flag: "🇺🇾",
    country: "Uruguay",
    club: "Racing de Montevideo",
    verified: false,
  },
];

export const MY_PROFILE = {
  name: "Ismael Ulman",
  position: "Mediocampista",
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
