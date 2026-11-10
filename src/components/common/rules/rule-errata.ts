import { Language } from "../../../i18n/locale";

// Rules Manual, official designers' commentary, July 2026, supplied faq 1.pdf,
// page 4. Keep the source catalogue intact and identify the dated addition.
const offBattlefieldRules = new Set([
  "Cave Dweller",
  "Fly",
  "Mountain Dweller",
  "Spectral Walk",
  "Swift Movement",
  "Woodland Creature",
]);

export function ruleErratum(name: string, language: Language) {
  if (!offBattlefieldRules.has(name)) return undefined;
  return language === "es"
    ? {
        source: "Errata del reglamento — julio de 2026",
        text: "Esta regla especial puede ser utilizada por miniaturas que todavía no se encuentran en el campo de batalla.",
      }
    : {
        source: "Rules Manual erratum — July 2026",
        text: "This special rule may be used by models that are not yet on the battlefield.",
      };
}
