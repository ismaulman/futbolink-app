import { ImageSourcePropType } from "react-native";

export type SuccessCase = {
  id: string;
  name: string;
  role: string; // edad y nacionalidad, como en la web
  flag: string;
  testimonial: string;
  image: ImageSourcePropType;
};

// Historias reales publicadas en la web (hoy fijas; llegan de la API al conectar).
export const SUCCESS_CASES: SuccessCase[] = [
  {
    id: "1",
    name: "Pablo Toani",
    role: "Jugador de Fútbol",
    flag: "🇦🇷",
    testimonial:
      "Gracias a FutboLink encontré mi lugar en Italia. Hoy juego en el Mesoraca y estoy viviendo una experiencia increíble.",
    image: require("../assets/success/pablo.jpg"),
  },
  {
    id: "2",
    name: "Facundo Espindola",
    role: "24 años — Argentino",
    flag: "🇦🇷",
    testimonial:
      "FutboLink me ayudó a mostrarme y gracias a eso llegué a 9 de Julio. Estoy feliz de poder seguir creciendo en el Federal A.",
    image: require("../assets/success/facundo.jpg"),
  },
  {
    id: "3",
    name: "Raimundo Pedro Martins Da Silva",
    role: "29 años — Brasiliano",
    flag: "🇧🇷",
    testimonial:
      "Con FutboLink pude dar el salto y venir a Italia. Ahora juego en el Mesoraca, cumpliendo un sueño que siempre tuve.",
    image: require("../assets/success/raimundo.jpg"),
  },
  {
    id: "4",
    name: "Julian Picart",
    role: "19 años — Argentino",
    flag: "🇦🇷",
    testimonial:
      "A través de FutboLink, conecté con clubes de España y terminé firmando en UE Alcudia. Muy contento con todo el proceso.",
    image: require("../assets/success/julian.jpg"),
  },
];
