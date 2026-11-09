import { Button } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FaPatreon } from "react-icons/fa";
import discord from "../../assets/images/homepage/discord.png";
import { useTranslation } from "../../i18n/LanguageContext";
import { Attribution } from "../about/sections/Attribution";
import { FeatureTabs } from "./FeatureTabs.tsx";

export const DISCORD_LINK = "https://discord.gg/Hmjetd9NDf";
export const PATREON_LINK = "https://www.patreon.com/mesbg_list_builder";

export const Home = () => {
  const { t: translateUI } = useTranslation();

  const { t } = useTranslation();
  return (
    <Container maxWidth={false} sx={{ mt: 2, mb: 5 }}>
      <Stack direction="column" gap={1} flexWrap="wrap">
        <Stack direction="row" justifyContent="space-between">
          <Stack gap={1} sx={{ maxWidth: "min(100%, 84ch)" }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography
                variant="h5"
                className="middle-earth"
                sx={{ pt: 2.4, my: 0 }}
              >
                {t("Welcome to the")}
              </Typography>
              <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
                <img
                  src={discord}
                  alt={translateUI("Discord — original project community")}
                  style={{ height: "44px" }}
                />
              </a>
            </Stack>
            <Typography variant="h3" className="middle-earth" sx={{ mt: 0 }}>
              MESBG List Builder ES
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "1.3rem" }}>
              {t(
                "The MESBG List Builder is a unofficial utility tool for the Middle Earth Strategy Battle Game by Games Workshop. This webapp strives to be the best list builder out there by creating an easy to navigate and simple to use application.",
              )}
            </Typography>

            <Attribution />

            <Button
              variant="text"
              size="large"
              startIcon={<FaPatreon />}
              sx={{
                my: 2,
                color: "#F96854",
              }}
              onClick={() => window.open(PATREON_LINK, "_blank")}
            >
              {t("Patreon — support the original creators")}
            </Button>
          </Stack>
        </Stack>

        <FeatureTabs />
      </Stack>
    </Container>
  );
};
