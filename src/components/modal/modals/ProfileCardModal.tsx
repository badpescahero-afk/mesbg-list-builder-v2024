import { Alert, Button, DialogContent, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { Fragment, useMemo, useState } from "react";
import { heroConstraintData, profileData } from "../../../assets/data.ts";
import { useScreenSize } from "../../../hooks/calculations-and-displays/useScreenSize.ts";
import { useTranslation } from "../../../i18n/LanguageContext";
import { useAppState } from "../../../state/app";
import { Unit } from "../../../types/mesbg-data.types.ts";
import { SelectedUnit } from "../../../types/roster.ts";
import { UnitProfileCard } from "../../atoms/unit-profile/UnitProfileCard.tsx";
import { ConfiguredProfileCard } from "../../common/configured-cards/ConfiguredProfileCard";
import {
  configuredCardForUnit,
  referenceCard,
} from "../../common/configured-cards/card-model";
import { downloadConfiguredCards } from "../../common/configured-cards/export-cards";

export const ProfileCardModal = () => {
  const {
    modalContext: { unit },
  } = useAppState();
  const { language, t } = useTranslation();
  const [configured, setConfigured] = useState(language === "es");
  const selectedCard = useMemo(
    () =>
      unit && typeof unit.pointsPerUnit === "number"
        ? configuredCardForUnit(unit as SelectedUnit)
        : unit
          ? referenceCard(unit.profile_origin, unit.name)
          : null,
    [unit],
  );
  const { palette } = useTheme();
  const [downloading, setDownloading] = useState(false);
  const [failed, setFailed] = useState(false);
  const { isMobile } = useScreenSize();

  const OverflowProfileCards = ({ unit }: { unit: Unit }) => {
    const data = profileData[unit.profile_origin]?.[unit.name];
    if (!data) return null;
    return data.overflow_cards?.map((profile) => (
      <Fragment key={profile}>
        <UnitProfileCard army={unit.profile_origin} profile={profile} />
      </Fragment>
    ));
  };

  const ExtraHeroProfileCards = ({ unit }: { unit: Unit }) => {
    const data = heroConstraintData[unit.model_id];
    if (!data) return null;
    return data.extra_profiles?.map((profile) => (
      <Fragment key={profile}>
        <UnitProfileCard army={unit.profile_origin} profile={profile} />
      </Fragment>
    ));
  };

  return (
    <>
      <DialogContent>
        {failed && <Alert severity="error">{t("Download failed")}</Alert>}
        {selectedCard && (
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button onClick={() => setConfigured(!configured)} sx={{ mb: 2 }}>
              {configured
                ? t("Show original card")
                : t("Show card with selected equipment")}
            </Button>
            {configured && (
              <Button
                disabled={downloading}
                onClick={async () => {
                  setDownloading(true);
                  setFailed(false);
                  try {
                    await downloadConfiguredCards([selectedCard]);
                  } catch {
                    setFailed(true);
                  } finally {
                    setDownloading(false);
                  }
                }}
              >
                {downloading ? t("Generating cards...") : t("Download")}
              </Button>
            )}
          </Stack>
        )}
        {configured && selectedCard ? (
          <ConfiguredProfileCard card={selectedCard} />
        ) : (
          <>
            <Typography variant="body2" color={palette.text.secondary}>
              {t("Download all cards from the roster's export menu.")}
            </Typography>

            {unit != null && (
              <Box
                sx={{
                  maxWidth: isMobile ? "100%" : "900px",
                  m: "auto",
                }}
              >
                <UnitProfileCard
                  army={unit.profile_origin}
                  profile={unit.name}
                />
                <OverflowProfileCards unit={unit} />
                <ExtraHeroProfileCards unit={unit} />
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </>
  );
};
