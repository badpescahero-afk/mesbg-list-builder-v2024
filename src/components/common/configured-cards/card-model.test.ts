import { describe, expect, it } from "vitest";
import { mesbgData, profileData } from "../../../assets/data.ts";
// This existing factory does not use React hooks; exercise its real point calculation.
import { useCalculator as createCalculator } from "../../../hooks/calculations-and-displays/useCalculator.ts";
import { convertRosterToProfiles } from "../../../hooks/profiles/profile-utils/profiles.ts";
import names from "../../../i18n/content/names.es.json";
import { Roster, SelectedUnit } from "../../../types/roster.ts";
import {
  configuredCardForUnit,
  configuredCardsForRoster,
  referenceCard,
} from "./card-model";

function select(
  name: string,
  options: string[] = [],
  quantity = 1,
  army = "Minas Tirith",
) {
  const raw = Object.values(mesbgData).find(
    (unit) => unit.name === name && unit.army_list === army,
  );
  if (!raw) throw new Error(`Missing fixture ${name} in ${army}`);
  const unit: SelectedUnit = {
    ...structuredClone(raw),
    id: `${name}-${options.join()}`,
    quantity,
    pointsPerUnit: 0,
    pointsTotal: 0,
  };
  unit.options = unit.options.map((option) => ({
    ...option,
    quantity: option.included || options.includes(option.name) ? 1 : 0,
  }));
  return createCalculator().recalculatePointsForUnit(unit);
}
function roster(units: SelectedUnit[]) {
  return { warbands: [{ hero: null, units }] } as Roster;
}

describe("configured cards use real loadouts without changing game data", () => {
  it("uses per-model points and shield modifiers, independently of stack size", () => {
    const unit = select("Warrior of Minas Tirith", ["Shield"], 12);
    const card = configuredCardForUnit(unit);
    expect(card.points).toBe(9);
    expect(unit.pointsTotal).toBe(108);
    expect(card.quantity).toBe(12);
    expect(card.profiles[0].D).toBe("6");
    expect(card.options.map((option) => option.name)).toEqual(["Shield"]);
    expect(profileData.Gondor[unit.name].D).toBe("5");
  });
  it("reflects replacements, free included options and mounts from actual data", () => {
    const knight = configuredCardForUnit(
      select("Knight of Minas Tirith", [
        "Exchange shield and lance for banner",
      ]),
    );
    expect(knight.points).toBe(40);
    expect(knight.profiles[0].D).toBe("5");
    expect(
      knight.profiles[0].additional_stats.some(
        (profile) => profile.name === "Horse",
      ),
    ).toBe(true);
    const faramir = configuredCardForUnit(
      select("Faramir", ["Horse", "Shield"]),
    );
    expect(faramir.points).toBe(125); // Current army data: 100 + 20 + 5, not 90 from the image.
    expect(faramir.profiles[0].D).toBe("7"); // Armour replacement (+1), then shield (+1).
    expect(faramir.options.find((option) => option.included).name).toBe(
      "Exchange armour and bow for heavy armour",
    );
    const boromir = configuredCardForUnit(
      select("Boromir, Captain of the White Tower", ["Horse", "Shield"]),
    );
    expect(boromir.points).toBe(185);
    expect(boromir.profiles[0].D).toBe("7");
    expect(boromir.profiles[0].HM).toBe("6");
    expect(
      boromir.profiles[0].additional_stats.find(
        (profile) => profile.name === "Horse",
      ).Mv,
    ).toBe('10"');
  });
  it("resolves the explicitly declared mount in a combined horse/throwing-spears option", () => {
    const raw = Object.values(mesbgData).find(
      (unit) =>
        unit.name === "Rohan Royal Guard" &&
        unit.options.some(
          (option) => option.name === "Horse and throwing spears",
        ),
    );
    const card = configuredCardForUnit(
      select(raw.name, ["Horse and throwing spears"], 1, raw.army_list),
    );
    expect(
      card.profiles[0].additional_stats.find(
        (profile) => profile.name === "Horse",
      ).Mv,
    ).toBe('10"');
  });
  it("keeps distinct equipment variants while merging equal configurations", () => {
    const a = select("Warrior of Minas Tirith", ["Shield"], 5);
    const b = select("Warrior of Minas Tirith", ["Shield and spear"], 4);
    const c = select("Warrior of Minas Tirith", ["Shield"], 3);
    const original = JSON.stringify([a, b, c]);
    const result = configuredCardsForRoster(roster([a, b, c]));
    expect(result.missing).toEqual([]);
    expect(result.cards.map((card) => [card.points, card.quantity])).toEqual([
      [9, 8],
      [10, 4],
    ]);
    expect(JSON.stringify([a, b, c])).toBe(original);
  });
  it("isolates the existing Ringwraith A assignment from shared source profiles", () => {
    const raw = Object.values(mesbgData).find(
      (unit) =>
        unit.profile_origin === "Mordor" &&
        unit.options.some((option) => option.name === "3A / 3M / 18W / 3F"),
    );
    expect(raw).toBeDefined();
    const unit = select(raw.name, ["3A / 3M / 18W / 3F"], 1, raw.army_list);
    const before = JSON.stringify(profileData);
    expect(configuredCardForUnit(unit).profiles[0].A).toBe("3");
    expect(JSON.stringify(profileData)).toBe(before);
  });
  it("keeps the existing PDF transformer callable with its original roster API", () => {
    const result = convertRosterToProfiles(
      roster([select("Warrior of Minas Tirith", ["Shield"])]),
    );
    expect(result.missing).toEqual([]);
    expect(result.profiles[0].D).toBe("5");
    expect(result.profiles[0].additional_stats[0].D).toBe("6");
  });
  it("reports absent profiles without altering the roster or emitting a guessed card", () => {
    const unit = select("Warrior of Minas Tirith", ["Shield"]);
    unit.name = "Unknown profile";
    const before = JSON.stringify(unit);
    const result = configuredCardsForRoster(roster([unit]));
    expect(result.cards).toEqual([]);
    expect(result.missing).toEqual(["Gondor: Unknown profile"]);
    expect(JSON.stringify(unit)).toBe(before);
  });
  it("can prepare every current base selection without mutating the shared catalogues", () => {
    const before = JSON.stringify([mesbgData, profileData]);
    let prepared = 0;
    for (const raw of Object.values(mesbgData)) {
      const unit: SelectedUnit = {
        ...structuredClone(raw),
        id: raw.model_id,
        quantity: 1,
        pointsPerUnit: 0,
        pointsTotal: 0,
        options: raw.options.map((option) => ({
          ...option,
          quantity: option.included ? 1 : 0,
        })),
      };
      const selection = createCalculator().recalculatePointsForUnit(unit);
      const card = configuredCardForUnit(selection);
      if (card) {
        prepared++;
        expect(Number.isFinite(card.points), raw.model_id).toBe(true);
        expect(card.profiles.length, raw.model_id).toBeGreaterThan(0);
      }
    }
    expect(prepared).toBe(Object.keys(mesbgData).length);
    expect(JSON.stringify([mesbgData, profileData])).toBe(before);
  });
});

it("provides a reference card and Spanish display name for every source profile and nested profile", () => {
  const before = JSON.stringify(profileData);
  const visit = (
    origin: string,
    name: string,
    profile: (typeof profileData)[string][string],
  ) => {
    expect(names[name], name).toBeTruthy();
    const card = referenceCard(origin, name);
    expect(card, `${origin}: ${name}`).not.toBeNull();
    expect(card.points).toBeNull();
    expect(card.profiles[0].D).toBe(profile.D);
    profile.additional_stats?.forEach((extra) =>
      visit(origin, extra.name, extra),
    );
  };
  for (const [origin, profiles] of Object.entries(profileData)) {
    for (const [name, profile] of Object.entries(profiles))
      visit(origin, name, profile);
  }
  expect(
    referenceCard("Gondor", "Boromir, Captain of the White Tower").profiles[0]
      .HM,
  ).toBe("6");
  expect(JSON.stringify(profileData)).toBe(before);
});
it("prepares every individual option without changing points, option ids or shared profiles", () => {
  const before = JSON.stringify([mesbgData, profileData]);
  for (const raw of Object.values(mesbgData)) {
    for (const option of raw.options) {
      const unit = select(raw.name, [option.name], 1, raw.army_list);
      const saved = JSON.stringify(unit);
      const card = configuredCardForUnit(unit);
      expect(card, raw.model_id + option.name).not.toBeNull();
      expect(card.points).toBe(unit.pointsPerUnit);
      expect(JSON.stringify(unit)).toBe(saved);
    }
  }
  expect(JSON.stringify([mesbgData, profileData])).toBe(before);
});
