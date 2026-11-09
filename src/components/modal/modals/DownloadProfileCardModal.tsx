import {
  Button,
  DialogActions,
  DialogContent,
  ImageList,
  ImageListItem,
  LinearProgress,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useMemo, useRef, useState } from "react";
import { heroConstraintData, profileData } from "../../../assets/data.ts";
import { useRosterInformation } from "../../../hooks/calculations-and-displays/useRosterInformation.ts";
import { useDownload } from "../../../hooks/export/useDownload.ts";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { useAppState } from "../../../state/app";
import { isSelectedUnit } from "../../../types/roster.ts";
import { CustomAlert } from "../../atoms/alert/CustomAlert.tsx";
import { UnitProfileCard } from "../../atoms/unit-profile/UnitProfileCard.tsx";
import { ConfiguredProfileCard } from "../../common/configured-cards/ConfiguredProfileCard";
import { configuredCardsForRoster } from "../../common/configured-cards/card-model";
import { downloadConfiguredCards } from "../../common/configured-cards/export-cards";
import { AlertTypes } from "../../notifications/alert-types.tsx";

export const DownloadProfileCardModal = () => {
  const { roster } = useRosterInformation();
  const { language, t } = useTranslation();
  const [configured, setConfigured] = useState(language === "es");
  const [downloading, setDownloading] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => () => controller.current?.abort(), []);
  const [downloadError, setDownloadError] = useState(false);
  const prepared = useMemo(() => configuredCardsForRoster(roster), [roster]);
  const { closeModal, triggerAlert } = useAppState();
  const { downloadProfileCards } = useDownload();
  const [profileCards, setProfileCards] = useState<string[]>([]);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.down("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const profileCards: string[] = [];
    roster.warbands.forEach((warband) => {
      if (warband.hero) {
        profileCards.push(
          [warband.hero.profile_origin, warband.hero.name].join("|"),
        );
        const heroProfile =
          profileData[warband.hero.profile_origin][warband.hero.name];
        if (heroProfile) {
          heroProfile.overflow_cards?.forEach((profile) =>
            profileCards.push([warband.hero.profile_origin, profile].join("|")),
          );
        }
        if (
          warband.hero.unit_type !== "Siege Engine" &&
          (heroConstraintData[warband.hero.model_id]?.extra_profiles || [])
            .length > 0
        ) {
          heroConstraintData[warband.hero.model_id]["extra_profiles"].forEach(
            (profile: string) => {
              profileCards.push(
                [warband.hero.profile_origin, profile].join("|"),
              );
            },
          );
        }
      }
      warband.units.filter(isSelectedUnit).forEach((unit) => {
        if (unit.unit_type !== "Siege Equipment") {
          profileCards.push([unit.profile_origin, unit.name].join("|"));
          const unitProfile = profileData[unit.profile_origin][unit.name];
          if (unitProfile) {
            unitProfile.overflow_cards?.forEach((profile) =>
              profileCards.push(
                [warband.hero.profile_origin, profile].join("|"),
              ),
            );
          }
        }
      });
    });
    const profileCardsSet = new Set(profileCards);
    setProfileCards([...profileCardsSet]);
  }, [roster]);

  const handleDownload = async () => {
    if (configured) {
      setDownloading(true);
      setDownloadError(false);
      try {
        controller.current = new AbortController();
        await downloadConfiguredCards(prepared.cards, {
          signal: controller.current.signal,
          onProgress: setProgress,
        });
        closeModal();
      } catch {
        if (!controller.current?.signal.aborted) setDownloadError(true);
      } finally {
        setDownloading(false);
      }
      return;
    }
    downloadProfileCards()
      .catch(() => triggerAlert(AlertTypes.DOWNLOAD_FAILED))
      .finally(closeModal);
  };

  return (
    <>
      <DialogContent>
        <ToggleButtonGroup
          exclusive
          value={configured ? "configured" : "original"}
          disabled={downloading}
          onChange={(_, value) => {
            if (value) setConfigured(value === "configured");
          }}
          sx={{ mb: 2 }}
        >
          <ToggleButton value="configured">
            {t("Spanish cards with selected equipment")}
          </ToggleButton>
          <ToggleButton value="original">{t("Original cards")}</ToggleButton>
        </ToggleButtonGroup>
        {downloadError && (
          <CustomAlert severity="error" title="">
            {t(
              "Could not generate the cards. Your roster has not been changed. You can retry or download the original cards.",
            )}
          </CustomAlert>
        )}
        {configured && prepared.missing.length > 0 && (
          <CustomAlert severity="warning" title="">
            {t("Missing profile data for configured cards:")}{" "}
            {prepared.missing.join(", ")}
          </CustomAlert>
        )}
        {configured ? (
          <>
            <CustomAlert severity="info" title="">
              {t(
                "One card per equipment configuration. Points are per model, and stats include the equipment modifiers recorded in the list builder. Conditional combat effects are described in the rules.",
              )}
            </CustomAlert>
            {prepared.cards.map((card) => (
              <div key={card.key} style={{ marginTop: 16 }}>
                <ConfiguredProfileCard card={card} />
              </div>
            ))}
          </>
        ) : (
          <>
            <CustomAlert severity="info" title="">
              <TranslatedText message="The following profile cards will be downloaded (in high resolution)." />
            </CustomAlert>
            <ImageList cols={isMobile ? 1 : isTablet ? 2 : isDesktop ? 3 : 4}>
              {profileCards
                .map((profile) => profile.split("|"))
                .map(([army, profile], index) => (
                  <ImageListItem key={index} cols={1}>
                    <UnitProfileCard profile={profile} army={army} />
                  </ImageListItem>
                ))}
            </ImageList>
          </>
        )}
      </DialogContent>
      {downloading && (
        <div role="status" style={{ padding: "8px 24px" }}>
          <Typography>
            {progress > prepared.cards.length
              ? t("Preparing ZIP...")
              : t("Generating card {{current}} of {{total}}", {
                  current: progress,
                  total: prepared.cards.length,
                })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, (progress / prepared.cards.length) * 100)}
          />
        </div>
      )}
      <DialogActions>
        <Button
          variant="text"
          color="inherit"
          onClick={() => {
            controller.current?.abort();
            closeModal();
          }}
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--cancel-button"
        >
          <TranslatedText message="Cancel" />
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          disabled={
            downloading ||
            (configured &&
              (prepared.cards.length === 0 || prepared.missing.length > 0))
          }
          sx={{ minWidth: "20ch" }}
          data-test-id="dialog--submit-button"
        >
          {downloading ? t("Generating cards...") : t("Download")}
        </Button>
      </DialogActions>
    </>
  );
};
