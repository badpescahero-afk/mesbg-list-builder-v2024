import armies from "./content/armies.es.json";
import equipment from "./content/equipment.es.json";
import keywords from "./content/keywords.es.json";
import names from "./content/names.es.json";
import profiles from "./content/profiles.es.json";
import terms from "./content/terms.es.json";
import { Language } from "./locale";

const translations: Readonly<Record<string, string>> = {
  ...terms,
  ...names,
  ...keywords,
  ...armies,
  ...profiles,
  ...equipment,
};

/** Presentation only: never feed translated text into identifiers or rules. */
export function translateGameText(
  language: Language,
  original: string,
): string {
  if (language === "en") return original;
  if (Object.prototype.hasOwnProperty.call(translations, original)) {
    return translations[original];
  }
  const parameterised = /^(.*)\(([^()]+)\)$/.exec(original);
  if (parameterised) {
    const key = `${parameterised[1]}(X)`;
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      const parameter = parameterised[2]
        .split(/(,\s*|\s+or\s+|\s+and\s+)/)
        .map((part) =>
          /^\s+or\s+$/.test(part)
            ? " o "
            : /^\s+and\s+$/.test(part)
              ? " y "
              : translations[part] || part,
        )
        .join("");
      return translations[key].replace("(X)", `(${parameter})`);
    }
  }
  return original;
}
