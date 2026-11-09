import { useTranslation } from "./LanguageContext";

/** Translate static UI prose without adding markup or touching game values. */
export function TranslatedText({ message }: { message: string }) {
  const { t } = useTranslation();
  return t(message);
}
