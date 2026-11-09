import { Stack, TextField, Typography } from "@mui/material";
import { forwardRef, MouseEvent, useImperativeHandle, useState } from "react";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { ArmySelectionInput } from "../../atoms/army-selector/ArmySelectionInput.tsx";
import { CustomSwitch } from "../../atoms/switch/CustomSwitch.tsx";
import { AdditionalTagsInput } from "../../atoms/tags-input/TagsInput.tsx";
import { useCreateRoster } from "./useCreateRoster.ts";

export type CreateSiegeRosterHandlers = {
  handleCreateRoster: (e: MouseEvent) => void;
};
export const CreateSiegeRoster = forwardRef<CreateSiegeRosterHandlers>(
  (_, ref) => {
    const { t: translateUI } = useTranslation();

    const {
      armyList,
      setArmyList,
      rosterName,
      updateRosterName,
      maxRosterPoints,
      tags,
      setTags,
      updateMaxRosterPoints,
      handleCreateNewRoster,
    } = useCreateRoster();

    const [siegeRole, setSiegeRole] = useState<"Attacker" | "Defender">(
      "Attacker",
    );

    useImperativeHandle(ref, () => ({
      handleCreateRoster: (e) => handleCreateNewRoster(e, true, siegeRole),
    }));

    return (
      <>
        <CustomAlert title="" severity="info">
          <TranslatedText message="Create a roster with siege options. This type of roster enables siege equipment like ladders, rams and barricades." />
        </CustomAlert>
        <ArmySelectionInput armyList={armyList} setArmyList={setArmyList} />
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          <Typography
            sx={
              siegeRole === "Defender"
                ? { textDecoration: "underline", fontWeight: "bold" }
                : { cursor: "pointer" }
            }
            onClick={() => setSiegeRole("Defender")}
          >
            <TranslatedText message="Defender" />
          </Typography>
          <CustomSwitch
            checked={siegeRole === "Attacker"}
            onChange={(_, checked) =>
              setSiegeRole(checked ? "Attacker" : "Defender")
            }
            name="siege role"
          />
          <Typography
            sx={
              siegeRole === "Attacker"
                ? { textDecoration: "underline", fontWeight: "bold" }
                : { cursor: "pointer" }
            }
            onClick={() => setSiegeRole("Attacker")}
          >
            <TranslatedText message="Attacker" />
          </Typography>
        </Stack>
        <TextField
          fullWidth
          label={translateUI("Roster name (Optional)")}
          value={rosterName}
          onChange={(e) => updateRosterName(e.target.value)}
        />
        <TextField
          fullWidth
          label={translateUI("Points (Optional)")}
          value={maxRosterPoints}
          helperText={
            maxRosterPoints !== "" && Number(maxRosterPoints) <= 0
              ? translateUI("Please enter a value above 0")
              : ""
          }
          error={maxRosterPoints !== "" && Number(maxRosterPoints) <= 0}
          onChange={(e) => updateMaxRosterPoints(e.target.value)}
          slotProps={{
            input: { type: "number" },
          }}
        />
        <AdditionalTagsInput values={tags} onChange={setTags} size="medium" />
      </>
    );
  },
);
