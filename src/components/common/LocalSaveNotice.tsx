import { Alert, AlertTitle } from "@mui/material";
import { useTranslation } from "../../i18n/LanguageContext";

export const LocalSaveNotice = () => {
  const { t } = useTranslation();
  return (
    <Alert severity="info" sx={{ my: 2 }}>
      <AlertTitle>{t("Automatic local saving")}</AlertTitle>
      {t(
        "Your lists, collection, games and settings are saved automatically in this browser. No account is needed and data is not synced between devices.",
      )}{" "}
      {t(
        "Export your lists as JSON for backup or to move them to another device. Clearing browser data or changing the site address does not preserve this local copy.",
      )}
    </Alert>
  );
};
