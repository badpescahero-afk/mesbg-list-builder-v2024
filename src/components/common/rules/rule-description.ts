import { keywords } from "../../../assets/data";

/** Resolve names only for reading; never change the canonical rule or its parameter. */
export function ruleDescription(name: string) {
  const exact = keywords.find((rule) => rule.name === name);
  if (exact) return exact;
  const normal = name
    .replace(/^Hated \(/, "Hatred (")
    .replace(/\.$/, "")
    .replace(/\s*\(/, " (");
  const template = name.endsWith("bane")
    ? "Bane Weapons"
    : normal.replace(/\(.*?\)/g, "(X)");
  return (
    keywords.find((rule) => rule.name === template) ||
    keywords.find((rule) => rule.name === `${normal} (X)`) ||
    keywords.find((rule) => rule.name === normal.replace(/\s*\(.*?\)/g, ""))
  );
}
