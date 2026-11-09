import { translateGameText } from "./game-text";
import { Language } from "./locale";

/** Labels only; preserve each canonical value in forms and saved game data. */
export const translateArmyNames = (language: Language, names: string) =>
  names
    .split(/(,\s*)/)
    .map((name) => translateGameText(language, name))
    .join("");

export const matchesArmySearch = (
  language: Language,
  original: string,
  query: string,
) => {
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase();
  return [original, translateGameText(language, original)].some((name) =>
    normalize(name).includes(normalize(query)),
  );
};
