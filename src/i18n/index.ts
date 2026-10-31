import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import es from "./locales/es.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";

// Mismos idiomas que la web.
export const LANGUAGES = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

function deviceLanguage(): LanguageCode {
  const code = getLocales()[0]?.languageCode ?? "es";
  return LANGUAGES.some((l) => l.code === code) ? (code as LanguageCode) : "es";
}

i18n.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
    it: { translation: it },
    pt: { translation: pt },
  },
  lng: deviceLanguage(),
  fallbackLng: "es",
  // Las claves son planas ("auth.login"), y los valores del catálogo
  // del backend ("Delantero Centro") pueden tener espacios o puntos.
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
});

// Traduce un valor del catálogo de la plataforma (posiciones, categorías,
// beneficios…). Si no existe traducción, muestra el valor tal cual.
export function tc(value: string): string {
  return i18n.t("catalog." + value, { defaultValue: value });
}

export default i18n;
