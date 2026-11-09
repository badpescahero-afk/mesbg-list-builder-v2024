import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { About as AboutSection } from "./sections/About";
import { Attribution } from "./sections/Attribution";
import { Contact } from "./sections/Contact";
import { Features } from "./sections/Features";
export const About = () => (
  <Container maxWidth="lg" sx={{ mt: 2, mb: 5 }}>
    <Attribution full />
    <Stack gap={4} sx={{ mt: 4 }}>
      <AboutSection />
      <Contact />
      <Features />
    </Stack>
  </Container>
);
