import { useTranslation } from "./LanguageContext";
import { StatKey, statLabel } from "./stat-labels";

export function StatLabel({
  stat,
  full = false,
}: {
  stat: StatKey;
  full?: boolean;
}) {
  const { language } = useTranslation();
  return (
    <span
      title={statLabel(language, stat, true)}
      aria-label={statLabel(language, stat, true)}
    >
      {statLabel(language, stat, full)}
    </span>
  );
}
