import { Button, Stack } from "@mui/material";
import { FaPatreon } from "react-icons/fa";
import { useTranslation } from "../../../i18n/LanguageContext";
import { ADAPTATION_ISSUES } from "../../../project-links";
import { DISCORD_LINK, PATREON_LINK } from "../../home/Home";
import { Link } from "../components/Link";
import { Section } from "../components/Section";
export const Contact = () => {
  const { t } = useTranslation();
  return (
    <Section title={t("Community and support")}>
      <Stack gap={2} sx={{ mt: 2 }}>
        <Link to={ADAPTATION_ISSUES}>
          {t("Report a problem with the Spanish adaptation")}
        </Link>
        <Link to={DISCORD_LINK}>
          {t("Discord — original project community")}
        </Link>
        <Link to="mailto:support@mesbg-list-builder.com">
          {t("Email — original project support")}
        </Link>
        <Button
          variant="outlined"
          href={PATREON_LINK}
          startIcon={<FaPatreon />}
        >
          {t("Patreon — support the original creators")}
        </Button>
      </Stack>
    </Section>
  );
};
