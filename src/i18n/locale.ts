import { spanish } from "./spanish";

export type Language = "es" | "en";
export const LANGUAGE_STORAGE_KEY = "mesbg-ui-language";
export const DEFAULT_LANGUAGE: Language = "es";

export function isLanguage(value: unknown): value is Language {
  return value === "es" || value === "en";
}

// English source messages are stable keys. Missing Spanish entries keep the
// original UI usable while translation is introduced incrementally.
export function translate(language: Language, message: string): string {
  return language === "es" &&
    Object.prototype.hasOwnProperty.call(spanish, message)
    ? spanish[message as keyof typeof spanish]
    : message;
}

export function readLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isLanguage(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}
