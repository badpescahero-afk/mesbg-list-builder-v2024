import names from "../../../i18n/content/names.es.json";

/** Display only. Never use a translated name for lookup or persistence. */
export function cardName(name: string): string {
  return (names as Record<string, string>)[name] || name;
}
