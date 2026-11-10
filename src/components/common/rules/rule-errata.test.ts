import { describe, expect, it } from "vitest";
import { ruleDescription } from "./rule-description";
import { ruleErratum } from "./rule-errata";

describe("July 2026 Rules Manual additions", () => {
  it.each([
    "Cave Dweller",
    "Fly",
    "Mountain Dweller",
    "Spectral Walk",
    "Swift Movement",
    "Woodland Creature",
  ])(
    "adds the dated clarification to %s without rewriting its source",
    (name) => {
      const before = JSON.stringify(ruleDescription(name));
      expect(ruleErratum(name, "es")?.text).toContain(
        "todavía no se encuentran en el campo de batalla",
      );
      expect(ruleErratum(name, "en")?.text).toContain(
        "not yet on the battlefield",
      );
      expect(JSON.stringify(ruleDescription(name))).toBe(before);
    },
  );
  it("does not attach a clarification to unrelated or unknown rules", () => {
    expect(ruleErratum("Shieldwall", "es")).toBeUndefined();
    expect(ruleErratum("Future rule", "es")).toBeUndefined();
  });
});
