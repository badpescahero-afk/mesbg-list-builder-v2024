import FormControlLabel from "@mui/material/FormControlLabel";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FunctionComponent } from "react";
import { useTranslation } from "../../../i18n/LanguageContext";
import { translateGameText } from "../../../i18n/game-text";
import { Option } from "../../../types/mesbg-data.types.ts";
import { CustomSwitch } from "../switch/CustomSwitch.tsx";

export type OptionItemProps = {
  option: Option;
  selectable?: boolean;
  onSelect: (selected: boolean) => void;
  testId: string;
  testName: string;
};

export const OptionItem: FunctionComponent<OptionItemProps> = ({
  option,
  selectable = true,
  onSelect,
  testId,
  testName,
}) => {
  const { language, t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <FormControlLabel
      sx={{
        display: "flex",
        py: 0.2,
        "& .MuiFormControlLabel-label": {
          overflowWrap: "anywhere",
          minWidth: 0,
        },
        "& .MuiSwitch-root": { flexShrink: 0 },
        "& .MuiFormControlLabel-asterisk": { display: "none" },
        "&:hover": {
          textDecoration: "underline",
        },
      }}
      data-test-id={testId}
      data-test-option-name={testName}
      control={
        <CustomSwitch
          checked={option.quantity === 1}
          disabled={!selectable || option.included}
          onChange={(_, checked) => onSelect(checked)}
          name={option.name}
          color={
            option.type === "special_warband_upgrade" ? "secondary" : "primary"
          }
          sx={{ my: isMobile ? -0.5 : -2 }}
        />
      }
      label={`${translateGameText(language, option.name)} (${option.points} ${t("points")})`}
    />
  );
};
