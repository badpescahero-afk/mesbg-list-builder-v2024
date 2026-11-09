import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { Link } from "../components/Link.tsx";
import { Paragraph } from "../components/Paragraph.tsx";
import { Section } from "../components/Section.tsx";

export const About = () => {
  const { t: translateUI } = useTranslation();

  const githubUrl = "https://github.com/avcordaro/mesbg-list-builder-v2024";
  return (
    <Section title={translateUI("About")}>
      <Paragraph>
        <TranslatedText message="The MESBG List Builder is a webapp developed by Alex Cordaro and Marcel Hollink. We strive to create the best list builder out there by creating an easy to navigate and simple to use application." />
      </Paragraph>
      <Paragraph>
        <TranslatedText message="The webapp was originally built by Alex for the Middle Earth Strategy Battle game released in 2018, which was later adapted to fit mobile devices by Marcel. We both have a great passion for this tool and love to explore what we can achieve for the community by providing new updates and features." />
      </Paragraph>
      <Paragraph>
        <TranslatedText message="Both of us spend our free time maintaining and updating the webapp and are not interested in making the app paid or adding adverts (which would disrupt the user experience). There is no need for you to pull your wallet to build your army list." />
      </Paragraph>
      <Paragraph>
        <TranslatedText message="The list builder is open source (" />
        <Link to={githubUrl}>
          <TranslatedText message="you can find it here" />
        </Link>
        <TranslatedText
          message={
            "). If you'd like to help you can fork the repository and provide your corrections via pull request. A list of currently reported and open issues can be found in"
          }
        />{" "}
        <Link to={`${githubUrl}/issues`}>
          <TranslatedText message="the Github issues list" />
        </Link>
        <TranslatedText message=". Please refer to this list when reporting any issues to avoid duplicates." />
      </Paragraph>
    </Section>
  );
};
