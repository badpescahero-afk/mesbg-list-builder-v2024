import { Button, DialogActions, DialogContent, TextField } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../hooks/cloud-sync/useApi.ts";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { useAppState } from "../../../state/app";
import { useRosterBuildingState } from "../../../state/roster-building";
import {
  GroupIconSelector,
  Option as IconOption,
} from "../../atoms/group-icon/GroupIconSelector.tsx";
import { AlertTypes } from "../../notifications/alert-types.tsx";

export const UpdateGroupModal = () => {
  const { t: translateUI } = useTranslation();

  const {
    closeModal,
    modalContext: { groupId, redirect },
    triggerAlert,
  } = useAppState();
  const { updateGroup, groups } = useRosterBuildingState();
  const { id, name, icon } =
    groups.find((group) => group.slug === groupId) || {};
  const api = useApi();

  const navigate = useNavigate();

  const [rosterGroupName, setRosterGroupName] = useState(name);
  const [rosterGroupNameValid, setRosterGroupNameValid] = useState(true);
  const [rosterGroupIcon, setRosterGroupIcon] = useState<IconOption>({
    name: icon || "",
  } as IconOption);

  const handleUpdateRosterGroup = (e) => {
    e.preventDefault();

    const rosterGroupNameValue = rosterGroupName.trim();
    const nameValid = !!rosterGroupNameValue;
    setRosterGroupNameValid(nameValid);

    if (nameValid) {
      const group = {
        id: groupId,
        name: rosterGroupNameValue,
        slug: groupId,
        icon: rosterGroupIcon?.name,
      };
      updateGroup(id, group);
      api.updateGroup(group);
      if (redirect === true) {
        navigate(`/rosters/${group.slug}`);
      }
      triggerAlert(AlertTypes.UPDATE_GROUP_SUCCES);
      closeModal();
    }
  };

  function updateRosterGroupName(value: string) {
    setRosterGroupName(value);
    setRosterGroupNameValid(true);
  }

  return (
    <>
      <DialogContent sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
        <TextField
          sx={{ mt: 2 }}
          fullWidth
          label={translateUI("New group name")}
          error={!rosterGroupNameValid}
          helperText={
            !rosterGroupNameValid
              ? translateUI("The group name cannot be empty.")
              : ""
          }
          value={rosterGroupName}
          onChange={(e) => updateRosterGroupName(e.target.value)}
        />
        <GroupIconSelector
          selectedIcon={rosterGroupIcon}
          setSelectedIcon={setRosterGroupIcon}
        />
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
          onClick={handleUpdateRosterGroup}
          disabled={!rosterGroupNameValid}
          data-test-id="dialog--submit-button"
        >
          <TranslatedText message="Update group" />
        </Button>
      </DialogActions>
    </>
  );
};
