import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { createContext, useContext, useId, useState } from "react";
import { LanguageContext } from "../../../i18n/LanguageContext";
import { translateGameText } from "../../../i18n/game-text";
import { Language } from "../../../i18n/locale";
import { ruleDescription } from "./rule-description";
import "./rule-reference.css";

// Captures use plain text; interactive previews expose keyboard/touch controls.
export const RuleHelpEnabled = createContext(true);

export function RuleReference({
  name,
  description,
  type,
  language: override,
  label,
}: {
  name: string;
  description?: string;
  type?: string;
  language?: Language;
  label?: string;
}) {
  const context = useContext(LanguageContext);
  const language = override || context?.language || "es";
  const interactive = useContext(RuleHelpEnabled);
  const [open, setOpen] = useState(false);
  const id = useId();
  const rule = ruleDescription(name);
  const text = description || rule?.description;
  const title = label || translateGameText(language, name);
  const kind = type || rule?.active_passive;
  if (!interactive) return <>{title}</>;
  return (
    <>
      <button
        type="button"
        className="rule-reference"
        data-rule-name={name}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={language === "es" ? "Ver explicación" : "Read explanation"}
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
      >
        {title}
        <span className="rule-reference-mark" aria-hidden="true">
          {" "}
          ⓘ
        </span>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={id}
        maxWidth="sm"
        fullWidth
        onClick={(event) => event.stopPropagation()}
      >
        <DialogTitle id={id}>{title}</DialogTitle>
        <DialogContent dividers>
          {kind && (
            <p>
              <b>
                {language === "es"
                  ? { Active: "Activa", Passive: "Pasiva" }[kind] || kind
                  : kind}
              </b>
            </p>
          )}
          {text ? (
            <div
              style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{
                __html: translateGameText(language, text),
              }}
            />
          ) : (
            <p>
              {language === "es"
                ? "Los datos originales no incluyen una explicación de esta regla."
                : "The original data does not include a description of this rule."}
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            {language === "es" ? "Cerrar" : "Close"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
