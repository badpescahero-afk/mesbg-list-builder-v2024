import { PropsWithChildren, useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext";
import {
  isLanguage,
  LANGUAGE_STORAGE_KEY,
  readLanguage,
  translate,
} from "./locale";

export function LanguageProvider({ children }: PropsWithChildren) {
  const [language, setLanguage] = useState(readLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Storage may be unavailable; switching language still works in memory.
    }
  }, [language]);

  useEffect(() => {
    const syncLanguage = (event: StorageEvent) => {
      if (event.key === LANGUAGE_STORAGE_KEY) {
        setLanguage(
          isLanguage(event.newValue) ? event.newValue : readLanguage(),
        );
      }
    };
    window.addEventListener("storage", syncLanguage);
    return () => window.removeEventListener("storage", syncLanguage);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: (message, values) => translate(language, message, values),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
