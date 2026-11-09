import { createContext, useContext } from "react";
import { Language, TranslationValues } from "./locale";

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
  t: (message: string, values?: TranslationValues) => string;
} | null>(null);

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useTranslation requires LanguageProvider");
  return context;
}
