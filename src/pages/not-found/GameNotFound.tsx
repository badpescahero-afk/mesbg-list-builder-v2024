import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import brokenSword from "../../assets/images/broken-sword.png";
import { useTranslation } from "../../i18n/LanguageContext";
import { TranslatedText } from "../../i18n/TranslatedText";
import { useGameModeState } from "../../state/gamemode";
import { Roster } from "../../types/roster.ts";
import { DISCORD_LINK } from "../home/Home.tsx";

interface GamestateNotFoundProps {
  roster: Roster;
}

export const GamestateNotFound = ({ roster }: GamestateNotFoundProps) => {
  const { t: translateUI } = useTranslation();

  const navigate = useNavigate();
  const startGame = useGameModeState((state) => state.startNewGame);

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
        <TranslatedText message="Game not found!" />
      </Typography>
      <img
        alt={translateUI("Image of a broken sword")}
        src={brokenSword}
        style={{ width: "300px", margin: "auto" }}
      />
      <Typography component="blockquote">
        <TranslatedText
          message={'"No songs are sung of this company... yet."'}
        />
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <TranslatedText message="The road lies before you, untrodden and full of peril." />{" "}
        <br />{" "}
        <TranslatedText message="To write the tale of this roster, you must first take the first step upon the path." />
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
          <Button color="inherit" fullWidth onClick={() => startGame(roster)}>
            <TranslatedText message="Start a new game for" /> {roster.name}
          </Button>
          <Button
            color="inherit"
            fullWidth
            onClick={() => navigate(`/roster/${roster.id}`)}
          >
            <TranslatedText message="Head back to the roster builder" />
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
