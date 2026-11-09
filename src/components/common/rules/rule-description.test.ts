import { describe, expect, it } from "vitest";
import { keywords, profileData } from "../../../assets/data";
import { ruleDescription } from "./rule-description";

describe("rule explanations", () => {
  it("resolves every keyword, spell and heroic action in the catalogue", () => {
    for (const keyword of keywords)
      expect(ruleDescription(keyword.name)).toBe(keyword);
    const visit = (profile: (typeof profileData)[string][string]) => {
      for (const name of [
        ...(profile.special_rules || []),
        ...(profile.heroic_actions || []),
        ...(profile.magic_powers || []).map((power) => power.name),
      ]) {
        expect(ruleDescription(name)?.description, name).toBeTruthy();
      }
      profile.additional_stats?.forEach(visit);
    };
    Object.values(profileData).flatMap(Object.values).forEach(visit);
  });
  it("recognises source spelling/spacing variants without changing the source", () => {
    expect(ruleDescription("Dominant(4)")?.name).toBe("Dominant (X)");
    expect(ruleDescription("Hated (Orc)")?.name).toBe("Hatred (X)");
    expect(ruleDescription('Throw Stones (range 8", Strength 1).')?.name).toBe(
      "Throw Stones (X)",
    );
    expect(ruleDescription("Terror (Hobbit)")?.name).toBe("Terror");
    expect(ruleDescription("Unrecorded rule")).toBeUndefined();
  });
});
