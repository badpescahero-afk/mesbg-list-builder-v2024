import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { TranslatedText } from "../../../../i18n/TranslatedText";

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
  options: string;
  points: number;
  unique: boolean;
  legacy?: boolean;
}) => {
  return (
    <Stack direction="row" gap={1} justifyContent="space-between">
      <Typography>
        <strong>
          {(!unique || quantity > 1) && <>{quantity}</>} {name}
          {legacy ? <sup>&#10013;</sup> : ""}
        </strong>{" "}
        {options && (
          <span style={{ whiteSpace: "nowrap" }}>
            <TranslatedText message="with" /> {options}
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
