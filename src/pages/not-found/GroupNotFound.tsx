import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import brokenSword from "../../assets/images/broken-sword.png";
import { useTranslation } from "../../i18n/LanguageContext";
import { TranslatedText } from "../../i18n/TranslatedText";
import { DISCORD_LINK } from "../home/Home.tsx";

export const GroupNotFound = () => {
  const { t: translateUI } = useTranslation();

  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        gap: 2,
        p: 2,
        my: 4,
      }}
    >
      <Typography variant="h4" className="middle-earth">
        <TranslatedText message="Group not found!" />
      </Typography>
      <img
        alt={translateUI("Image of a broken sword")}
        src={brokenSword}
        style={{ width: "300px", margin: "auto" }}
      />
      <Typography sx={{ mb: 2 }}>
        <TranslatedText
          message={'"The group you sought has passed into shadow.'}
        />
        <br />
        <TranslatedText
          message={
            'Its voices are silent, its tale untold, and its road forever untraveled."'
          }
        />
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          p: 1,
        }}
      >
        <Stack gap={2}>
          <Button
            color="inherit"
            fullWidth
            onClick={() => navigate("/rosters")}
          >
            <TranslatedText message="Return the your rosters." />
          </Button>
          <Button color="inherit" fullWidth onClick={() => navigate("/")}>
            <TranslatedText message="Return to the homepage" />
          </Button>
          <Button
            color="inherit"
            fullWidth
            onClick={() => window.open(DISCORD_LINK)}
          >
            <TranslatedText message="Ask for support" />
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
