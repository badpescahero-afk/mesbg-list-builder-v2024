import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { Paragraph } from "../components/Paragraph.tsx";
import { Section } from "../components/Section";

export const Features = () => {
  const { t: translateUI } = useTranslation();
  return (
    <Section title={translateUI("Features")}>
      <Stack component="ul" direction="column" spacing={1}>
        <Box component="li">
          <Paragraph>
            <TranslatedText message="Build lists on mobile or desktop, with automatic saving in this browser. Accounts and cloud sync are currently unavailable; use JSON export/import to move lists between devices." />
          </Paragraph>
        </Box>

        <Box component="li">
          <Paragraph>
            <strong>
              <TranslatedText message="Custom (handmade) profile cards" />
            </strong>{" "}
            <TranslatedText message="for all the models in the range, including all the books and downloadable PDF-files, and the ability to download and print them for your created army list for" />{" "}
            <strong>
              <TranslatedText message="quick reference" />
            </strong>
            .{" "}
            <sup>
              <TranslatedText message="*not usable as book replacement." />
            </sup>
          </Paragraph>
        </Box>
        <Box component="li">
          <Paragraph>
            <strong>
              <TranslatedText message="PDF print-out" />
            </strong>{" "}
            <TranslatedText message="for your list, providing all a quick reference table for the stats, summary for the special rules and magical powers you have in play. Comes with Might/Will/Fate/Wounds tracking." />
          </Paragraph>
        </Box>
        <Box component="li">
          <Paragraph>
            <strong>
              <TranslatedText message="Game Mode" />
            </strong>{" "}
            <TranslatedText message="which provides digital stat trackers as an interactive alternative to the PDF print-out, allowing you to;" />
            <ul>
              <Box component="li">
                <TranslatedText message="Track the Might/Will/Fate/Wounds of your heroes." />
              </Box>
              <Box component="li">
                <TranslatedText message="Track the casualties and break point calculation of your army." />
              </Box>
              <Box component="li">
                <TranslatedText message="Additionally displays army bonuses and profile cards all on one screen." />
              </Box>
            </ul>
          </Paragraph>
        </Box>
        <Box component="li">
          <Paragraph>
            <strong>
              <TranslatedText message="All relevant roster information" />
            </strong>{" "}
            <TranslatedText message="available; such as amount of units, bow & throw limit, breakpoint, ect - in the drawer on the right, which collapses for Mobile users." />
          </Paragraph>
        </Box>
        <Box component="li">
          <Paragraph>
            <TranslatedText message="Automatically includes mandatory units and provides alert" />{" "}
            <strong>
              <TranslatedText message="notifications for illegal roster combinations" />
            </strong>
            .
          </Paragraph>
        </Box>
        <Box component="li">
          <Paragraph>
            <strong>
              <TranslatedText message="Match History" />
            </strong>{" "}
            <TranslatedText message="which allows you to keep track of your matches from Game Mode, as well as being able to add matches manually for when you use the PDF print-out." />
            <ul>
              <Box component="li">
                <TranslatedText message="You match history will be provided with various graphs to help visualise and break down your match experience over time." />
              </Box>
            </ul>
          </Paragraph>
        </Box>
      </Stack>
    </Section>
  );
};
