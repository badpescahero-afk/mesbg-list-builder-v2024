import { Fragment } from "react";
import { TranslatedText } from "../../../i18n/TranslatedText";

export const ExportHistoryAlert = () => (
  <Fragment>
    <b>
      <TranslatedText message="Data successfully copied to your clipboard." />
    </b>
    <hr />
    <TranslatedText
      message={
        "You can keep this somewhere safe, such as in a text file, to reload your again later using 'Import history'."
      }
    />
  </Fragment>
);
