import { Autocomplete, ListItemIcon, TextField } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { JSX } from "react";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { factionLogos, gameIcons, numberIcons } from "./icons.tsx";

export type Option = {
  name: string;
  icon: JSX.Element;
  type: "Faction Icons" | "Custom Icons" | "Number Icons";
};

export const GroupIconSelector = ({
  selectedIcon,
  setSelectedIcon,
}: {
  selectedIcon: Option;
  setSelectedIcon: (newValue: Option) => void;
}) => {
  const { t: translateUI } = useTranslation();

  const getIconSet = (
    icons: Record<string, JSX.Element>,
    type: Option["type"],
  ): Option[] =>
    Object.entries(icons)
      .map(([name, icon]) => ({ name, icon, type }))
      .sort((a, b) => a.name.localeCompare(b.name));

  const options: Option[] = [
    ...getIconSet(factionLogos, "Faction Icons"),
    ...getIconSet(gameIcons, "Custom Icons"),
    ...getIconSet(numberIcons, "Number Icons"),
  ];

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        return (
          <ListItem {...props} key={option.name}>
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.name}</ListItemText>
          </ListItem>
        );
      }}
      groupBy={(option) => translateUI(option.type)}
      value={selectedIcon}
      onChange={(_, newValue) => {
        setSelectedIcon(newValue);
      }}
      filterSelectedOptions
      blurOnSelect={true}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={translateUI("Type to filter...")}
          label={translateUI("Group Icon (optional)")}
          helperText={
            <Typography variant="body2" component="span">
              <TranslatedText message="Extra custom icons can be included on request. See" />{" "}
              <a href="https://react-icons.github.io/react-icons/">
                react-icons
              </a>{" "}
              <TranslatedText message="for all potential options." />
            </Typography>
          }
        />
      )}
    />
  );
};
