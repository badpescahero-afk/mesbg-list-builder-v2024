import { Button, DialogContent } from "@mui/material";
import { useTranslation } from "../../../i18n/LanguageContext";
import { TranslatedText } from "../../../i18n/TranslatedText";
import { useAppState } from "../../../state/app";

export const RosterSummaryScreenshotModal = () => {
  const { t: translateUI } = useTranslation();

  const { modalContext } = useAppState();
  return (
    <>
      <DialogContent>
        {modalContext.screenshot != null && (
          <>
            <img
              src={modalContext.screenshot}
              alt={translateUI("roster screenshot")}
              style={{
                margin: "1rem 0",
                border: "1px solid black",
                boxShadow: "1px 1px 5px 0px #000000AA",
                width: "100%",
              }}
            />
            <Button
              fullWidth
              variant="contained"
              href={modalContext.screenshot}
              download={modalContext.roster.id + ".png"}
            >
              <TranslatedText message="Save image" />
            </Button>
          </>
        )}
      </DialogContent>
    </>
  );
};
