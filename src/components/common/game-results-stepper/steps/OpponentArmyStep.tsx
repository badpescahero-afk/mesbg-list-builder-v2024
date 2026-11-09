import {
  Collapse,
  Stack,
  StepContent,
  StepLabel,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { TranslatedText } from "../../../../i18n/TranslatedText";
import { ArmyPicker } from "../../../atoms/army-selector/ArmyPicker.tsx";
import { StepProps } from "./StepProps.ts";

export const OpponentArmyStep: FunctionComponent<StepProps> = ({
  formValues,
  missingFields,
  updateFormValues,
  handleChangeByEvent,
  activeStep,
}) => {
  const { t: translateUI } = useTranslation();

  return (
    <>
      <StepLabel
        error={missingFields.includes("Opponent Armies")}
        optional={
          <Collapse in={!activeStep}>
            <Typography variant="caption" color="textDisabled">
              {formValues.opponentArmies}
            </Typography>
          </Collapse>
        }
      >
        <TranslatedText message="Players - Opponent Name & Army" />
      </StepLabel>
      <StepContent>
        <Typography>
          <TranslatedText message="Some extra description on what this step is about" />
        </Typography>
        <Stack gap={2} sx={{ my: 2 }}>
          <TextField
            fullWidth
            label={translateUI("Opponent Name")}
            name="opponentName"
            value={formValues.opponentName}
            onChange={handleChangeByEvent}
            size="small"
          />
          <ArmyPicker
            label={translateUI("Opponent Armies")}
            placeholder={translateUI("Your opponent's armies")}
            error={missingFields.includes("Opponent Armies")}
            onChange={(values) =>
              updateFormValues({
                opponentArmies: values.map((v) => v.army).join(", "),
              })
            }
            required
            defaultSelection={formValues.opponentArmies
              .split(",")
              .map((o) => o.trim())}
          />
        </Stack>
      </StepContent>
    </>
  );
};
