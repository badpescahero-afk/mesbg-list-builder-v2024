import { Box, Link, Stack, Typography } from "@mui/material";
import license from "../../../../LICENSE?raw";
import notices from "../../../../NOTICE.md?raw";
import { useTranslation } from "../../../i18n/LanguageContext";
import {
  ADAPTATION_ISSUES,
  ADAPTATION_SOURCE,
  ORIGINAL_PROJECT,
} from "../../../project-links";

export const Attribution = ({ full = false }: { full?: boolean }) => {
  const { t } = useTranslation();
  return (
    <Box
      component="section"
      aria-label={t("Credits and legal notices")}
      sx={{ my: 2, minWidth: 0, width: "100%" }}
    >
      <Typography variant="h5">{t("Unofficial Spanish adaptation")}</Typography>
      <Typography sx={{ my: 1 }}>
        {t(
          "This version was translated and edited by Pesca, from the Spanish MESBG community.",
        )}
      </Typography>
      <Typography sx={{ my: 1 }}>
        {t(
          "Based on MESBG List Builder by Alex Cordaro, Marcel Hollink and the original contributors. This adaptation is maintained separately and is not endorsed by the original developers or by Games Workshop or other rights holders.",
        )}
      </Typography>
      <Stack direction="row" useFlexGap flexWrap="wrap" gap={2}>
        <Link href={ORIGINAL_PROJECT}>{t("Original project")}</Link>
        <Link href={ADAPTATION_SOURCE}>{t("Source code of this version")}</Link>
        <Link href="/about#license">{t("License (AGPL-3.0-only)")}</Link>
        <Link href="/about#notices">{t("Legal notices")}</Link>
        <Link href={ADAPTATION_ISSUES}>
          {t("Report a problem with the Spanish adaptation")}
        </Link>
      </Stack>
      {full && (
        <Stack gap={2} sx={{ mt: 2 }}>
          <Typography>
            {t(
              "Adaptation notice — 2026-11-09: Spanish/English translation, rule explanations, configured Spanish cards, mobile layout, installable offline app and Spanish branding. Original game data and original cards are preserved.",
            )}
          </Typography>
          <Typography>
            {t(
              "The software is provided under AGPL-3.0-only, without warranty. If you redistribute or deploy a modified version, preserve its license and credits, identify your changes and provide the corresponding source code to its users as required by the license.",
            )}
          </Typography>
          <Typography id="notices" sx={{ scrollMarginTop: 100 }}>
            {t(
              "The software license does not grant rights to third-party rules, translations, artwork, photographs, logos or trademarks. These belong to their respective owners. Attribution, a disclaimer or free distribution does not replace any permission that may be required.",
            )}
          </Typography>
          <Box component="details" id="license" sx={{ scrollMarginTop: 100 }}>
            <summary>{t("License (AGPL-3.0-only)")}</summary>
            <Box
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                fontSize: "0.8rem",
              }}
            >
              {license}
            </Box>
          </Box>
          <Box component="details">
            <summary>{t("Original project notices (original text)")}</summary>
            <Box
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                fontSize: "0.8rem",
              }}
            >
              {notices}
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
};
