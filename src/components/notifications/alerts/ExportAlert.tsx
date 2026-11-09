import { Fragment } from "react";
import { TranslatedText } from "../../../i18n/TranslatedText";

export const ExportAlert = () => (
  <Fragment>
    <b>
      <TranslatedText message="JSON string copied to your clipboard." />
    </b>
    <hr />
    <TranslatedText
      message={
        "You can keep this somewhere safe, such as in a text file, to reload your army list again later using 'Import roster'."
      }
    />
  </Fragment>
);
