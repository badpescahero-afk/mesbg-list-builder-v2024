import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import brokenSword from "../../assets/images/broken-sword.png";
import { ModalTypes } from "../../components/modal/modals.tsx";
import { useTranslation } from "../../i18n/LanguageContext";
import { TranslatedText } from "../../i18n/TranslatedText";
import { ADAPTATION_ISSUES } from "../../project-links";
import { useAppState } from "../../state/app";

export const RosterNotFound = () => {
  const { t: translateUI } = useTranslation();

  const { setCurrentModal } = useAppState();
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
        <TranslatedText message="Roster not found!" />
      </Typography>
      <img
        alt={translateUI("Image of a broken sword")}
        src={brokenSword}
        style={{ width: "300px", margin: "auto" }}
      />
      <Typography sx={{ mb: 2 }}>
        <TranslatedText
          message={
            '"Even the wise cannot see all ends. The roster you seek is no longer in this realm'
          }
        />
        <br />{" "}
        <TranslatedText
          message={
            'perhaps it was never forged, or has been cast into the fires of Mount Doom."'
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
          <Button
            color="inherit"
            fullWidth
            onClick={() => setCurrentModal(ModalTypes.CREATE_NEW_ROSTER)}
          >
            <TranslatedText message="Create a new roster" />
          </Button>
          <Button color="inherit" fullWidth onClick={() => navigate("/")}>
            <TranslatedText message="Return to the homepage" />
          </Button>
          <Button
            color="inherit"
            fullWidth
            onClick={() =>
              window.open(ADAPTATION_ISSUES, "_blank", "noopener,noreferrer")
            }
          >
            <TranslatedText message="Ask for support" />
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};
