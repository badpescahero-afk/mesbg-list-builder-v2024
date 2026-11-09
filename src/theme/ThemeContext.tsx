/* eslint-disable react-refresh/only-export-components */
import CssBaseline from "@mui/material/CssBaseline";
import { esES, enUS } from "@mui/material/locale";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { useTranslation } from "../i18n/LanguageContext";
import { useUserPreferences } from "../state/preference"; // Import your themes
import { lightTheme, darkTheme } from "./themes";

type ThemeContextType = {
  toggleTheme: () => void;
  mode: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeContext must be used within ThemeContextProvider");
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const { language } = useTranslation();
  const { preferences, setPreference } = useUserPreferences();

  const toggleTheme = () => {
    setPreference("darkMode", !preferences.darkMode);
  };

  const theme = useMemo(
    () =>
      createTheme(
        preferences.darkMode ? darkTheme : lightTheme,
        language === "es" ? esES : enUS,
      ),
    [preferences.darkMode, language],
  );

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      preferences.darkMode ? "dark" : "light",
    );
  }, [preferences.darkMode]);

  return (
    <ThemeContext.Provider
      value={{ toggleTheme, mode: preferences.darkMode ? "dark" : "light" }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
