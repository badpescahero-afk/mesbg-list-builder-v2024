import { useTranslation } from "../../../i18n/LanguageContext";
import { Paragraph } from "../components/Paragraph";
import { Section } from "../components/Section";
export const About = () => {
  const { t } = useTranslation();
  return (
    <Section title={t("Original creators")}>
      <Paragraph>
        {t(
          "MESBG List Builder was created by Alex Cordaro and Marcel Hollink, with contributions from its community. Alex built the original application for the 2018 game, and Marcel adapted it for mobile devices.",
        )}
      </Paragraph>
      <Paragraph>
        {t(
          "MESBG List Builder ES builds on their work. Translation and additional features belong to this separate, unofficial adaptation; the original creators do not provide support for its changes.",
        )}
      </Paragraph>
    </Section>
  );
};
