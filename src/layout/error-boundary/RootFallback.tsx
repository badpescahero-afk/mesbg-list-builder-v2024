import { TranslatedText } from "../../i18n/TranslatedText";
import { ADAPTATION_ISSUES } from "../../project-links";
export const RootFallback = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "66ch",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <h3 style={{ fontSize: "2rem" }}>
            <TranslatedText message="A Shadow Has Fallen!" />
          </h3>
          <p>
            <TranslatedText message="“This page was cast into the fires of Mount Doom… and did not return”" />
          </p>
          <div>
            <div
              role="alert"
              style={{
                background: "rgb(253, 237, 237)",
                color: "rgb(95, 33, 32)",
                padding: "1.2rem",
                backgroundColor: "lightpink",
                borderRadius: "2px",
                textAlign: "left",
                marginBottom: "1rem",
              }}
            >
              <h4>
                <TranslatedText message="Help us help you!" />
              </h4>
              <div>
                <TranslatedText message="Report this error in the Spanish adaptation repository. Include what you were doing and a screenshot, without personal information." />
              </div>
            </div>
            <p>
              <a href={ADAPTATION_ISSUES}>
                <TranslatedText message="Report a problem with the Spanish adaptation" />
              </a>
              .
            </p>
          </div>

          <a
            href="https://mesbg-list-builder.com"
            style={{
              padding: "0.2rem",
              textTransform: "uppercase",
              fontSize: "0.9rem",
              background: "rgb(229, 246, 253)",
              borderColor: "rgb(1, 67, 97)",
              borderStyle: "solid",
              borderRadius: "2px",
              borderWidth: "1px",
              color: "rgb(1, 67, 97)",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <TranslatedText message="Return to the Shire" />
          </a>
        </div>
      </div>
    </>
  );
};
