// Browser test adapter only; never imported by the application.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ConfiguredProfileCard } from "../src/components/common/configured-cards/ConfiguredProfileCard";
import { ConfiguredCard } from "../src/components/common/configured-cards/card-model";

export function cardHtml(card: ConfiguredCard) {
  return renderToStaticMarkup(
    createElement(ConfiguredProfileCard, { card, interactive: false }),
  );
}
