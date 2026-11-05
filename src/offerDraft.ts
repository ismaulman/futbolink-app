import { CURRENCIES, MyOffer, Offer, OfferType } from "./data";

// Formulario de oferta (publicar, editar o duplicar).
export type OfferDraft = {
  type: OfferType;
  position: string;
  title: string;
  country: string;
  city: string;
  category: string;
  genre: string;
  salary: string;
  currency: string;
  contract: string;
  minAge: string;
  maxAge: string;
  description: string;
  extras: string[];
};

export const EMPTY_DRAFT: OfferDraft = {
  type: "player",
  position: "",
  title: "",
  country: "",
  city: "",
  category: "Semiprofesional",
  genre: "Masculino",
  salary: "",
  currency: "€",
  contract: "",
  minAge: "",
  maxAge: "",
  description: "",
  extras: [],
};

// Arma el formulario a partir de una oferta publicada; sin ella, usa lo básico de la oferta propia.
export function offerToDraft(offer: Offer | null | undefined, my?: MyOffer): OfferDraft {
  if (!offer) {
    return { ...EMPTY_DRAFT, type: my?.type ?? "player", title: my?.title ?? "" };
  }
  const currency = CURRENCIES.find((c) => offer.salary.startsWith(c)) ?? "€";
  const salary = offer.salary.startsWith(currency) ? offer.salary.slice(currency.length) : offer.salary;
  const city = offer.region.includes(",") ? offer.region.split(",")[0].trim() : "";
  return {
    type: offer.type,
    position: offer.positions[0] ?? "",
    title: offer.title,
    country: offer.country,
    city,
    category: offer.category,
    genre: offer.sportGenres,
    salary: salary.replace(/[^0-9]/g, ""),
    currency,
    contract: offer.contractDuration,
    minAge: offer.minAge ? String(offer.minAge) : "",
    maxAge: offer.maxAge ? String(offer.maxAge) : "",
    description: offer.description,
    extras: offer.extras ?? [],
  };
}
