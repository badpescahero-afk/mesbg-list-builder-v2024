import { describe, expect, it } from "vitest";
import armySource from "../assets/data/army_list_data.json";
import keywords from "../assets/data/keywords.json";
import unitSource from "../assets/data/mesbg_data.json";
import profileSource from "../assets/data/profile_data.json";
import armyTranslations from "./content/armies.es.json";
import equipmentTranslations from "./content/equipment.es.json";
import translations from "./content/keywords.es.json";
import profileTranslations from "./content/profiles.es.json";
import terms from "./content/terms.es.json";
import { translateGameText } from "./game-text";

describe("localised rules with original game data", () => {
  it("covers every common rule, spell and heroic action without changing its source", () => {
    const before = JSON.stringify(keywords);
    for (const rule of keywords) {
      expect(
        Object.prototype.hasOwnProperty.call(translations, rule.name),
        rule.name,
      ).toBe(true);
      expect(
        Object.prototype.hasOwnProperty.call(translations, rule.description),
        rule.name,
      ).toBe(true);
      expect(translateGameText("en", rule.name)).toBe(rule.name);
      expect(translateGameText("en", rule.description)).toBe(rule.description);
      expect(translateGameText("es", rule.description)).not.toBe(
        rule.description,
      );
    }
    expect(JSON.stringify(keywords)).toBe(before);
  });

  it("keeps dice, numerical values and HTML structure in the common rules", () => {
    const numbers = (text: string) =>
      [...new Set(text.match(/[+-]?\d+(?:\.\d+)?/g) || [])].sort();
    const tags = (text: string) => text.match(/<\/?[a-z][^>]*>/gi) || [];
    for (const rule of keywords) {
      const translated = translateGameText("es", rule.description);
      expect(numbers(translated), rule.name).toEqual(numbers(rule.description));
      expect(tags(translated), rule.name).toEqual(tags(rule.description));
    }
  });

  it("localises visible keyword parameters without altering their range or source", () => {
    expect(translateGameText("es", "Fury (Orc)")).toBe("Furia (Orco)");
    expect(translateGameText("es", "Harbinger of Evil (12)")).toBe(
      "Heraldo del mal (12)",
    );
    expect(translateGameText("es", "Unknown future rule")).toBe(
      "Unknown future rule",
    );
    expect(translateGameText("es", "Strength")).toBe("Strength");
    expect(translateGameText("es", "Fury (Goblin, Orc)")).toBe(
      "Furia (Trasgo, Orco)",
    );
    expect(translateGameText("en", "Fury (Goblin, Orc)")).toBe(
      "Fury (Goblin, Orc)",
    );
  });
});

// Rules live in their original JSON files. Localisation must cover display text
// without rewriting those files or feeding Spanish names into game identifiers.

const allTranslations: Record<string, string> = {
  ...translations,
  ...armyTranslations,
  ...profileTranslations,
  ...equipmentTranslations,
};
type GameProfile = {
  active_or_passive_rules?: { name: string; description: string }[];
  additional_text?: string[];
  additional_stats?: GameProfile[];
  special_rules?: string[];
  heroic_actions?: string[];
  magic_powers?: { name: string }[];
  wargear?: string[];
};

describe("complete current game content", () => {
  it("uses Spanish rules terminology in prose while preserving stat headings", () => {
    for (const text of Object.values(allTranslations)) {
      expect(text).not.toMatch(
        /\b(?:Defence|Strength|Courage|Intelligence|Might|Fate|Wounds?|Attacks?|Fight Value|Shoot Value|Warriors?|Heroes?|Cavalry|Infantry|Stand Fast|Knocked Flying|Orcs?|Goblins?)\b/,
      );
      // Will Pieblanco is a character's name, not the Will resource.
      expect(text).not.toMatch(/\bWill\b(?! Pieblanco)/);
    }
    const shieldwall = keywords.find((rule) => rule.name === "Shieldwall");
    expect(translateGameText("es", shieldwall.description)).toContain(
      "+1 a Defensa",
    );
    expect(translateGameText("es", shieldwall.description)).toContain(
      "Caballería",
    );
    for (const label of ["Mv", "Fv", "Sv", "D", "Might", "Will", "Fate"])
      expect(translateGameText("es", label)).toBe(label);
    for (const [source, target] of Object.entries(terms)) {
      expect(target).not.toMatch(/\b(?:Warrior|Cavalry|Infantry|Defence)\b/);
      expect(translateGameText("en", source)).toBe(source);
    }
    expect(translateGameText("es", "Warrior of Minas Tirith")).toBe(
      "Guerrero de Minas Tirith",
    );
  });
  it("covers every army and profile description, rule title and equipment option", () => {
    const sourceBefore = JSON.stringify([
      armySource,
      profileSource,
      unitSource,
    ]);
    const check = (source: string) => {
      // Look up canonical names/templates before translating their display text.
      const template = source.replace(/\([^()]*\)$/, "(X)");
      expect(
        source in allTranslations || template in allTranslations,
        source,
      ).toBe(true);
      expect(translateGameText("en", source)).toBe(source);
      expect(translateGameText("es", source).length, source).toBeGreaterThan(0);
    };
    for (const army of Object.values(armySource)) {
      for (const rule of [...army.additional_rules, ...army.special_rules]) {
        if ("title" in rule) check(rule.title as string);
        check(rule.description);
      }
    }
    const inspect = (profile: GameProfile) => {
      for (const rule of profile.active_or_passive_rules || []) {
        check(rule.name);
        check(rule.description);
      }
      for (const text of profile.additional_text || []) check(text);
      for (const name of [
        ...(profile.special_rules || []),
        ...(profile.heroic_actions || []),
        ...(profile.wargear || []),
      ])
        check(name);
      for (const power of profile.magic_powers || []) check(power.name);
      for (const extra of profile.additional_stats || []) inspect(extra);
    };
    for (const models of Object.values(profileSource)) {
      for (const profile of Object.values(models))
        inspect(profile as GameProfile);
    }
    for (const unit of Object.values(unitSource)) {
      for (const option of unit.options) check(option.name);
    }
    expect(JSON.stringify([armySource, profileSource, unitSource])).toBe(
      sourceBefore,
    );
  });

  it("preserves all numerical values, dice modifiers and HTML in the full catalogue", () => {
    const numbers = (text: string) =>
      [...new Set(text.match(/[+-]?\d+(?:\.\d+)?/g) || [])].sort();
    const tags = (text: string) => text.match(/<\/?[a-z][^>]*>/gi) || [];
    for (const [source, target] of Object.entries(allTranslations)) {
      expect(numbers(target), source).toEqual(numbers(source));
      expect(tags(target), source).toEqual(tags(source));
    }
  });
});
