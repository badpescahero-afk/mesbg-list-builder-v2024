import { useTranslation } from "./LanguageContext";
import { translateWarning } from "./warnings";

export function WarningText({ message }: { message: string }) {
  const { language } = useTranslation();
  return translateWarning(language, message);
}
