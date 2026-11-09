import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Changelog as Changes } from "../components/drawer/drawers/Changelog.tsx";
import { TranslatedText } from "../i18n/TranslatedText";

export const Changelog = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 5 }}>
      <Typography variant="h4" className="middle-earth">
        <TranslatedText message="Changelog" />
      </Typography>
      <Changes />
    </Container>
  );
};
