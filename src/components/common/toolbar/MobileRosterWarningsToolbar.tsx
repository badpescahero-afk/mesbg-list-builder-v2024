import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRosterWarnings } from "../../../hooks/calculations-and-displays/useRosterWarnings.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { WarningText } from "../../../i18n/WarningText";
import { ROSTER_INFO_BAR_HEIGHT } from "./MobileRosterInfoToolbar.tsx";

export const MobileRosterWarningsToolbar = () => {
  const screen = useScreenSize();
  const warnings = useRosterWarnings();

  return (
    <>
      {!screen.isDesktop && (
        <Toolbar
          sx={{
            backgroundColor: (theme) => theme.palette.error.light,
            color: (theme) => theme.palette.error.contrastText,
            minHeight: `${ROSTER_INFO_BAR_HEIGHT}px !important`,
          }}
        >
          <Typography
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              textAlign: "center",
              width: "100%",
            }}
          >
            {warnings.length === 1 ? (
              <WarningText message={warnings[0].warning} />
            ) : (
              <TranslatedText message="There are multiple errors in the roster information." />
            )}
          </Typography>
        </Toolbar>
      )}
    </>
  );
};
