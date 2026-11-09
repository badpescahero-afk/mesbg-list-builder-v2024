import { MenuItem, TextField } from "@mui/material";
import { useTranslation } from "./LanguageContext";
import { isLanguage } from "./locale";

export function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();
  return (
    <TextField
      id="interface-language"
      select
      size="small"
      label={t("Language")}
      value={language}
      onChange={(event) => {
        if (isLanguage(event.target.value)) setLanguage(event.target.value);
      }}
      sx={{ minWidth: 110, mr: 1 }}
    >
      <MenuItem value="es">Español</MenuItem>
      <MenuItem value="en">English</MenuItem>
    </TextField>
  );
}
