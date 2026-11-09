import { Fragment } from "react";
import { TranslatedText } from "../../../i18n/TranslatedText";

export const ScreenshotCopiedAlert = () => (
  <Fragment>
    <b>
      <TranslatedText message="Image copied to your clipboard." />
    </b>
    <hr />
    <TranslatedText message="You can now save it or share it on your favorite social media." />
  </Fragment>
);
