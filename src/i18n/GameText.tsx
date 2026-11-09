import { useTranslation } from "./LanguageContext";
import { translateGameText } from "./game-text";

export function GameText({ text }: { text: string }) {
  const { language } = useTranslation();
  return translateGameText(language, text);
}
