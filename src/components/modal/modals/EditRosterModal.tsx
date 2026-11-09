import {
  Button,
  DialogActions,
  DialogContent,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNewRosterBuilder } from "../../../hooks/new-roster/useNewRosterBuilder.ts";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { translateGameText } from "../../../i18n/game-text";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import {
  ArmySelectionInput,
  SelectedArmyList,
} from "../../atoms/army-selector/ArmySelectionInput.tsx";
import { AdditionalTagsInput } from "../../atoms/tags-input/TagsInput.tsx";

export const EditRosterModal = () => {
  const { t: translateUI, language } = useTranslation();

  const {
    closeModal,
    modalContext: { roster },
  } = useAppState();
  const { updateRoster } = useRosterBuildingState();
  const rebuildRoster = useNewRosterBuilder();

  const [rosterName, setRosterName] = useState(roster?.name || "");
  const [rosterNameValid, setRosterNameValid] = useState(true);
  const [armyList, setArmyList] = useState<SelectedArmyList>({
    title: roster.armyList,
    army: roster.armyList,
    type: "",
  });
  const [tags, setTags] = useState(roster.metadata.tags || []);

  const [rosterPointsLimit, setRosterPointsLimit] = useState(
    roster?.metadata.maxPoints ? String(roster.metadata.maxPoints) : "",
  );
  const [rosterAddPoints, setRosterAddPoints] = useState(
    roster?.metadata.addPoints ? String(roster.metadata.addPoints) : "",
  );
  const [rosterAddUnits, setRosterAddUnits] = useState(
    roster?.metadata.addUnits ? String(roster.metadata.addUnits) : "",
  );
  const [rosterPointsLimitValid, setRosterPointsLimitValid] = useState(true);

  const handleUpdateRoster = (e) => {
    e.preventDefault();

    const rosterNameValue = rosterName.trim();
    const nameValid = !!rosterNameValue;
    setRosterNameValid(nameValid);

    const pointLimit = rosterPointsLimit.trim();
    const pointLimitValid = !pointLimit || Number(pointLimit) > 0;
    setRosterPointsLimitValid(pointLimitValid);

    if (nameValid && pointLimitValid) {
      if (armyList.army === roster.armyList) {
        updateRoster({
          ...roster,
          name: rosterNameValue,
          metadata: {
            ...roster.metadata,
            maxPoints: Number(pointLimit),
            addUnits: Number(rosterAddUnits),
            addPoints: Number(rosterAddPoints),
            tags,
          },
        });
      } else {
        updateRoster(
          rebuildRoster({
            id: roster.id,
            groupId: roster.group,
            name: rosterNameValue,
            armyList: armyList.army,
            maximumPoints: Number(pointLimit),
            addUnits: Number(rosterAddUnits),
            addPoints: Number(rosterAddPoints),
            enableSiege: roster.metadata.siegeRoster,
            siegeRole: roster.metadata.siegeRole,
            withHero: armyList.hero,
            tags,
          }),
        );
      }

      closeModal();
    }
  };

  function updateRosterName(value: string) {
    setRosterName(value);
    setRosterNameValid(true);
  }

  function updateRosterPointsLimit(value: string) {
    setRosterPointsLimit(value);
    setRosterPointsLimitValid(true);
  }

  function updateRosterAddPoints(value: string) {
    setRosterAddPoints(value);
  }

  function updateRosterAddUnits(value: string) {
    setRosterAddUnits(value);
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        {armyList.army !== roster.armyList && (
          <Box sx={{ mb: 2 }}>
            <CustomAlert
              severity="warning"
              title={translateUI("Changing the army list")}
            >
              <Typography>
                <TranslatedText message="Changing the army list on your roster will reset your current selection. You are basically starting over from scratch!" />
              </Typography>
            </CustomAlert>
          </Box>
        )}

        {roster.armyList.startsWith("Custom:") ? (
          <TextField
            value={translateGameText(language, roster.armyList)}
            label={translateUI("Army")}
            disabled
          />
        ) : (
          <ArmySelectionInput armyList={armyList} setArmyList={setArmyList} />
        )}

        <TextField
          fullWidth
          label={translateUI("Roster name")}
          error={!rosterNameValid}
          helperText={
            !rosterNameValid
              ? translateUI("Roster name cannot be empty and must be unique.")
              : ""
          }
          value={rosterName}
          onChange={(e) => updateRosterName(e.target.value)}
        />
        <TextField
          fullWidth
          label={translateUI("Points limit (optional)")}
          error={!rosterPointsLimitValid}
          helperText={
            !rosterPointsLimitValid
              ? translateUI("The roster points limit needs to be above 0")
              : ""
          }
          value={rosterPointsLimit}
          onChange={(e) => updateRosterPointsLimit(e.target.value)}
        />
        <AdditionalTagsInput values={tags} onChange={setTags} size="medium" />

        <Divider variant="middle">
          <Typography className="middle-earth" variant="h6">
            <TranslatedText message="Addtional settings" />
          </Typography>
        </Divider>
        <Stack direction="row" gap={2} sx={{ mb: -1 }}>
          <TextField
            fullWidth
            label={translateUI("Fake units")}
            value={rosterAddUnits}
            onChange={(e) => updateRosterAddUnits(e.target.value)}
          />
          <TextField
            fullWidth
            label={translateUI("Fake points")}
            value={rosterAddPoints}
            onChange={(e) => updateRosterAddPoints(e.target.value)}
          />
        </Stack>
        <FormHelperText sx={{ ml: 1.5 }}>
          <TranslatedText message="These are added or subtracted from the total units or points of the roster." />
        </FormHelperText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={closeModal}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          <TranslatedText message="Cancel" />
        </Button>
        <Button
          variant="contained"
          onClick={handleUpdateRoster}
          disabled={!rosterNameValid}
          data-test-id="dialog--submit-button"
        >
          <TranslatedText message="Update roster" />
        </Button>
      </DialogActions>
    </>
  );
};
