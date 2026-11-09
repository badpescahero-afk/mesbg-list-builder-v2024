import { Autocomplete, ListItemIcon, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import data from "../../../assets/data/mesbg_data.json";
import { useTranslation } from "../../../i18n/LanguageContext";
import { matchesArmySearch } from "../../../i18n/army-names";
import { translateGameText } from "../../../i18n/game-text";
import { ArmyType } from "../../../types/mesbg-data.types.ts";
import { FactionIcon } from "../faction-icon/FactionIcon.tsx";

export type SelectedArmyList = {
  title: string;
  type: string;
  hero?: string;
  army: string;
};

export type ArmySelectionInputProps = {
  armyList: SelectedArmyList;
  setArmyList: (armyList: SelectedArmyList) => void;
};

export const ArmySelectionInput = ({
  armyList,
  setArmyList,
}: ArmySelectionInputProps) => {
  const { t, language } = useTranslation();
  const label = (option: SelectedArmyList) =>
    option.hero
      ? `${translateGameText(language, option.hero)} (${translateGameText(language, option.army)})`
      : translateGameText(language, option.army);
  const armyTypeOrder: Record<ArmyType, number> = {
    "Evil (Legacy)": 4,
    "Good (Legacy)": 2,
    Evil: 3,
    Good: 1,
  };

  const armyLists = Object.values(data)
    .map((item) => ({
      title: item.army_list,
      army: item.army_list,
      type: item.army_type,
    }))
    .filter(
      (value, index, array) =>
        array.findIndex((other) => other.title === value.title) === index,
    )
    .sort((a, b) => armyTypeOrder[a.type] - armyTypeOrder[b.type]);

  const heroesPerArmy = Object.values(data)
    .filter((item) => item.unit_type && item.unit_type.includes("Hero"))
    .map((item) => ({
      title: `${item.name.split("(")[0].trim()} (${item.army_list})`,
      hero: item.name.split("(")[0].trim(),
      army: item.army_list,
      type: "Hero",
    }))
    .filter(
      (value, index, array) =>
        array.findIndex((other) => other.title === value.title) === index,
    )
    .sort((a, b) => armyTypeOrder[a.type] - armyTypeOrder[b.type]);

  return (
    <Autocomplete
      disableClearable
      options={[...armyLists, ...heroesPerArmy]}
      getOptionLabel={label}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      renderOption={(props, option) => {
        return (
          <ListItem {...props} key={option.title}>
            <ListItemIcon>
              <FactionIcon faction={option.army} />
            </ListItemIcon>
            <ListItemText>{label(option)}</ListItemText>
          </ListItem>
        );
      }}
      groupBy={(option) => t(option.type)}
      value={armyList}
      onChange={(_, newValue) => {
        setArmyList(newValue);
      }}
      filterOptions={(_, state) => {
        if (state.inputValue.length === 0) return armyLists;
        const f = state.inputValue.toLowerCase();
        const lists = armyLists.filter(({ army }) =>
          matchesArmySearch(language, army, f),
        );
        if (f.length < 3) {
          return lists;
        }
        const heroes = heroesPerArmy.filter(({ hero }) =>
          matchesArmySearch(language, hero, f),
        );
        return [...lists, ...heroes];
      }}
      blurOnSelect={true}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t("Type to filter...")}
          label={t("Army")}
          helperText={t(
            "Filter by typing the name of the Army List OR the name of a Hero you wish to play.",
          )}
        />
      )}
    />
  );
};
