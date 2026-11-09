import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";
import { armyListData } from "../../../../assets/data.ts";
import { useRosterInformation } from "../../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useTranslation } from "../../../../i18n/LanguageContext";
import { TranslatedText } from "../../../../i18n/TranslatedText";
import { translateGameText } from "../../../../i18n/game-text";
import { useUserPreferences } from "../../../../state/preference";
import { useThemeContext } from "../../../../theme/ThemeContext.tsx";
import {
  FreshUnit,
  isSelectedUnit,
  SelectedUnit,
} from "../../../../types/roster.ts";

function UnitRow({ unit }: { unit: FreshUnit | SelectedUnit }) {
  const { language } = useTranslation();
  if (!isSelectedUnit(unit)) {
    return (
      <TableRow>
        <TableCell size="small" colSpan={2}>
          <TranslatedText message="No Hero selected" />
        </TableCell>
      </TableRow>
    );
  }

  const options = unit?.options?.filter((option) => option.quantity > 0) || [];
  return (
    <TableRow>
      <TableCell size="small" width={12}>
        {unit.quantity}x
      </TableCell>
      <TableCell size="small">
        {unit.name}{" "}
        {options.length > 0 && (
          <>
            (
            {options
              ?.map(
                ({ quantity, max, name }) =>
                  `${max > 1 ? `${quantity} ` : ""}${translateGameText(language, name)}`,
              )
              ?.join(", ")}
            )
          </>
        )}
      </TableCell>
      <TableCell size="small" align="right">
        {unit.pointsTotal} <TranslatedText message="pts." />
      </TableCell>
    </TableRow>
  );
}

export const ArmyComposition = ({ noCaption }: { noCaption?: boolean }) => {
  const { roster, getAdjustedMetaData } = useRosterInformation();
  const { mode } = useThemeContext();
  const {
    preferences: { removePdfPageBreak },
  } = useUserPreferences();

  const warbands = roster.warbands.map((warband) => [
    warband.hero,
    ...warband.units.filter(isSelectedUnit),
  ]);

  const { might, units, points, bows, throwingWeapons, will, fate } =
    getAdjustedMetaData();
  const { break_point } = armyListData[roster.armyList];

  return (
    <Box id="pdf-army" className={removePdfPageBreak ? "" : "page-break"}>
      {noCaption !== true && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            <TranslatedText message="Army Composition" />
          </Typography>
          <Stack
            direction="row"
            gap={2}
            sx={{ mb: 1 }}
            justifyContent="space-between"
          >
            <Typography>
              <TranslatedText message="Points:" /> <b>{points}</b>
            </Typography>
            <Typography>
              <TranslatedText message="Units:" /> <b>{units}</b>
            </Typography>
            <Typography>
              <TranslatedText message="Bows:" /> <b>{bows}</b>
            </Typography>{" "}
            <Typography>
              <TranslatedText message="Throwing weapons:" />{" "}
              <b>{throwingWeapons}</b>
            </Typography>
          </Stack>{" "}
          <Stack
            direction="row"
            gap={2}
            sx={{ mb: 1 }}
            justifyContent="space-around"
          >
            <Typography>
              <TranslatedText message="Might / Will / Fate:" />{" "}
              <b>
                {might} / {will} / {fate}
              </b>
            </Typography>
            <Typography>
              <TranslatedText message="Break Point:" />{" "}
              <b>
                {units > 0 ? Math.floor(units * (break_point ?? 0.5)) + 1 : 0}{" "}
                <TranslatedText message="dead" />
              </b>
            </Typography>
            <Typography>
              <TranslatedText message="Quartered:" />{" "}
              <b>
                {Math.floor(0.25 * units)} <TranslatedText message="alive" />
              </b>
            </Typography>
          </Stack>
        </>
      )}
      <TableContainer component="div">
        <Table>
          <TableBody>
            {warbands.map((warband, index) => (
              <Fragment key={index}>
                <TableRow>
                  <TableCell
                    size="small"
                    colSpan={2}
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: mode === "dark" ? "#3F3F3F" : "#F3F3F3",
                    }}
                  >
                    <TranslatedText message="Warband" /> {index + 1}
                  </TableCell>
                  <TableCell
                    size="small"
                    align="right"
                    sx={{
                      fontWeight: "bold",
                      backgroundColor: mode === "dark" ? "#3F3F3F" : "#F3F3F3",
                    }}
                  >
                    {warband
                      .filter(isSelectedUnit)
                      .map((unit) => unit.pointsTotal)
                      .reduce((a, b) => a + b, 0)}{" "}
                    <TranslatedText message="pts." />
                  </TableCell>
                </TableRow>
                {warband.map((unit, index) => (
                  <UnitRow unit={unit} key={index} />
                ))}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
