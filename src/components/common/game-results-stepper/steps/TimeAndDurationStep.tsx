import {
  Collapse,
  InputAdornment,
  Stack,
  StepContent,
  StepLabel,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { TranslatedText } from "../../../../i18n/TranslatedText";
import { StepProps } from "./StepProps.ts";

export const TimeAndDurationStep: FunctionComponent<StepProps> = ({
  formValues,
  missingFields,
  handleChangeByEvent,
  activeStep,
}) => {
  const { t: translateUI } = useTranslation();

  return (
    <>
      <StepLabel
        error={
          missingFields.includes("Date of the Game") ||
          missingFields.includes("Duration")
        }
        optional={
          <Collapse in={!activeStep}>
            <Typography variant="caption" color="textDisabled">
              {formValues.gameDate}
            </Typography>
          </Collapse>
        }
      >
        <TranslatedText message="General - Time & Duration" />
      </StepLabel>
      <StepContent>
        <Typography>
          <TranslatedText message="When did this game take place and how long did it take to complete. These values are prefilled based on the start time and date of the game." />
        </Typography>
        <Stack gap={2} sx={{ my: 2 }}>
          <TextField
            fullWidth
            label={translateUI("Date of the Game")}
            name="gameDate"
            type="date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={formValues.gameDate}
            onChange={handleChangeByEvent}
            required
            error={missingFields.includes("Date of the Game")}
            size="small"
          />
          <TextField
            fullWidth
            label={translateUI("Duration")}
            name="duration"
            value={formValues.duration}
            onChange={handleChangeByEvent}
            required
            error={missingFields.includes("Duration")}
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <TranslatedText message="minutes" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Stack>
      </StepContent>
    </>
  );
};
