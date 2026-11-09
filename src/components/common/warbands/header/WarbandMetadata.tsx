import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FunctionComponent } from "react";
import { useScreenSize } from "../../../../hooks/calculations-and-displays/useScreenSize.ts";
import { TranslatedText } from "../../../../i18n/TranslatedText";
import { Warband } from "../../../../types/roster.ts";

export type WarbandMetadataProps = {
  meta: Warband["meta"];
};

export const WarbandMetadata: FunctionComponent<WarbandMetadataProps> = ({
  meta: { num, points, units, maxUnits },
}) => {
  const screen = useScreenSize();
  return (
    <Stack
      direction={screen.isMobile ? "column" : "row"}
      gap={screen.isMobile ? 0 : 2}
      flexGrow={1}
      data-test-id={`warband-header--${num}--metadata`}
    >
      {!screen.isMobile && (
        <Typography color="white">
          <TranslatedText message="Warband:" /> <b>{num}</b>
        </Typography>
      )}
      <Typography color="white">
        <TranslatedText message="Points:" /> <b>{points}</b>
      </Typography>
      <Typography
        color={maxUnits !== "-" && units > maxUnits ? "warning" : "white"}
      >
        <TranslatedText message="Units:" />{" "}
        <b>
          {units} / {maxUnits}
        </b>
      </Typography>
    </Stack>
  );
};
