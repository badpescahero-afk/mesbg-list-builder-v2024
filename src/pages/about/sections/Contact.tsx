import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { FaPatreon } from "react-icons/fa";
import discord from "../../../assets/images/homepage/discord.png";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { DISCORD_LINK, PATREON_LINK } from "../../home/Home.tsx";
import { Link } from "../components/Link.tsx";
import { Paragraph } from "../components/Paragraph";
import { Section } from "../components/Section";

export const Contact = () => {
  const { t: translateUI } = useTranslation();
  return (
    <Section
      title={translateUI("Connect with us")}
      additionalButton={
        <a href={DISCORD_LINK} target="_blank" rel="noreferrer">
          <img
            src={discord}
            alt={translateUI("join the list builder on discord")}
            style={{ height: "45px", float: "right" }}
          />
        </a>
      }
    >
      <Paragraph>
        <TranslatedText message="We welcome feedback, questions, and contributions from the community. You can reach us through the following channels:" />
      </Paragraph>

      <Stack component="ul" direction="column" spacing={1}>
        <Box component="li">
          <strong>Discord</strong>
          <TranslatedText message=": Join our community to chat in real time, ask questions, or share ideas." />
        </Box>
        <Box component="li">
          <strong>GitHub</strong>
          <TranslatedText message=": Report issues, contribute code, or follow ongoing development." />
        </Box>
        <Box component="li">
          <strong>
            <TranslatedText message="Email" />
          </strong>
          <TranslatedText message=": Prefer direct contact? Reach us at" />{" "}
          <Link to="mailto:support@mesbg-list-builder.com?subject=MESBG List Builder (v2024)">
            support@mesbg-list-builder.com
          </Link>
          .
        </Box>
        <Box component="li">
          <strong>Patreon</strong>
          <TranslatedText message=": Support our work and gain access to exclusive updates and insights." />
        </Box>
      </Stack>

      <Button
        variant="contained"
        color="inherit"
        size="large"
        startIcon={<FaPatreon />}
        sx={{
          my: 2,
          color: "#F96854",
        }}
        onClick={() => window.open(PATREON_LINK, "_blank")}
      >
        <TranslatedText message="Support us on patreon" />
      </Button>
    </Section>
  );
};
