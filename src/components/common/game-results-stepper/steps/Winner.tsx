import { Stack, StepContent, StepLabel, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ChangeEvent, FunctionComponent } from "react";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { TranslatedText } from "../../../../i18n/TranslatedText";
import { useGameModeState } from "../../../../state/gamemode";
import { CustomAlert } from "../../../atoms/alert/CustomAlert.tsx";
import { calculateResult } from "../../game-results-form/result.ts";
import { scenarios } from "../../game-results-form/scenarios.ts";
import { StepProps } from "./StepProps.ts";

export const WinnerStep: FunctionComponent<StepProps> = ({
  formValues,
  missingFields,
  updateFormValues,
}) => {
  const { t: translateUI } = useTranslation();

  const {
    additionalVictoryPoints,
    calculatedVictoryPoints,
    setAdditionalVictoryPoints,
  } = useGameModeState();

  const updateAdditionalVictoryPoints = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;
    if (name === "victoryPoints") {
      setAdditionalVictoryPoints([
        Number(value) - calculatedVictoryPoints[0],
        additionalVictoryPoints[1],
      ]);
    } else {
      setAdditionalVictoryPoints([
        additionalVictoryPoints[0],
        Number(value) - calculatedVictoryPoints[1],
      ]);
    }
  };

  const handleChangeVictoryPoints = (event: ChangeEvent<HTMLInputElement>) => {
    updateAdditionalVictoryPoints(event);
    const { name, value } = event.target;

    updateFormValues({
      [name]: value,
      result: calculateResult(
        name === "victoryPoints" ? value : formValues.victoryPoints,
        name === "opponentVictoryPoints"
          ? value
          : formValues.opponentVictoryPoints,
        formValues.result,
      ),
    });
  };

  return (
    <>
      <StepLabel
        error={
          missingFields.includes("Victory Points") ||
          missingFields.includes("Opponent's Victory Points")
        }
      >
        <TranslatedText message="Result - Winner" />
      </StepLabel>
      <StepContent>
        <Typography>
          {scenarios.includes(formValues.scenarioPlayed) ? (
            <TranslatedText message="Adjust the Victory Points if needed and calculate who won the game." />
          ) : (
            <TranslatedText message="Enter the Victory Points and calculate who won the game." />
          )}
        </Typography>

        <Stack gap={2} sx={{ my: 2 }}>
          <CustomAlert
            title={translateUI("Match result")}
            severity={
              formValues.result === "Draw"
                ? "info"
                : formValues.result === "Won"
                  ? "success"
                  : "error"
            }
          >
            {
              {
                Won: translateUI(
                  "Glory is yours! Songs shall be sung of this day!",
                ),
                Lost: translateUI(
                  "Your forces are shattered, and the enemy reigns supreme.",
                ),
                Draw: translateUI(
                  "The battle ended, but neither side was able to claim victory.",
                ),
              }[formValues.result]
            }
          </CustomAlert>

          <TextField
            fullWidth
            label={translateUI("Your VP's")}
            name="victoryPoints"
            value={formValues.victoryPoints}
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
            onChange={handleChangeVictoryPoints}
            size="small"
            error={missingFields.includes("Victory Points")}
            required
          />
          <TextField
            fullWidth
            label={translateUI("Opponent VP's")}
            name="opponentVictoryPoints"
            value={formValues.opponentVictoryPoints}
            type="number"
            slotProps={{ htmlInput: { min: 0 } }}
            onChange={handleChangeVictoryPoints}
            size="small"
            error={missingFields.includes("Opponent's Victory Points")}
            required
          />
        </Stack>
      </StepContent>
    </>
  );
};
