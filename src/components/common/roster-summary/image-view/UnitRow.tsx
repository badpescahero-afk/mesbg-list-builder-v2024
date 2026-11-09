import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { TranslatedText } from "../../../../i18n/TranslatedText";
import { translateGameText } from "../../../../i18n/game-text";

export const UnitRow = ({
  quantity,
  name,
  options,
  points,
  unique,
  legacy,
}: {
  quantity: number;
  name: string;
  options: string[];
  points: number;
  unique: boolean;
  legacy?: boolean;
}) => {
  const { language } = useTranslation();
  return (
    <Stack direction="row" gap={1} justifyContent="space-between">
      <Typography>
        <strong>
          {(!unique || quantity > 1) && <>{quantity}</>} {name}
          {legacy ? <sup>&#10013;</sup> : ""}
        </strong>{" "}
        {options.length > 0 && (
          <span style={{ whiteSpace: "nowrap" }}>
            <TranslatedText message="with" />{" "}
            {options
              .map((option) => translateGameText(language, option))
              .join(", ")}
          </span>
        )}
      </Typography>
      <Typography sx={{ minWidth: "7ch", textAlign: "end" }}>
        <b>
          {points} <TranslatedText message="pts" />
        </b>
      </Typography>
    </Stack>
  );
};
