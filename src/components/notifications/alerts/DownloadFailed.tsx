import { Fragment } from "react";
import { TranslatedText } from "../../../i18n/TranslatedText";

export const DownloadFailed = () => {
  return (
    <Fragment>
      <b>
        <TranslatedText message="Downloading failed" />
      </b>
      <p>
        <TranslatedText message="Sorry, something went wrong while downloading the files. Please try again later or contact us if the problem persists." />
      </p>
    </Fragment>
  );
};
