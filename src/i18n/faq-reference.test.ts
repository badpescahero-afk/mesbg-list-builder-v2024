import { describe, expect, it } from "vitest";
import { armyListData, mesbgData, profileData } from "../assets/data";
import { useCalculator as createCalculator } from "../hooks/calculations-and-displays/useCalculator";
import { SelectedUnit } from "../types/roster";
import { translateGameText } from "./game-text";

// External expectations: supplied July 2026 errata, faq3.pdf (Hobbit),
// faq4.pdf (LotR), faq5.pdf (Middle-earth). These verify existing data;
// they do not authorize changes to canonical identifiers or roster storage.
describe("costs and profiles checked against July 2026 errata", () => {
  it.each([
    ["[the-eagles] gwaihir", 200],
    ["[men-of-the-west] gwaihir", 200],
    ["[thorin's-company] gwaihir", 200],
    ["[the-battle-of-five-armies] gwaihir", 200],
    ["[radagast's-alliance] gwaihir", 200],
    ["[the-white-council] elrond", 170],
    ["[the-fiefdoms] prince-imrahil", 140],
    ["[the-grief-of-eomer] prince-imrahil", 140],
    ["[muster-of-isengard] uruk-hai-drummer", 35],
    ["[usurpers-of-edoras] war-mumak-of-harad", 250],
    ["[usurpers-of-edoras] haradrim-warrior", 6],
  ] as const)("retains %s at %i base points", (id, points) => {
    expect(mesbgData[id]?.base_points).toBe(points);
  });

  it("calculates the Black Rider's 105 points including its compulsory horse", () => {
    const source = mesbgData["[the-black-riders] ringwraith"];
    const before = JSON.stringify(source);
    const unit: SelectedUnit = {
      ...structuredClone(source),
      id: "faq-ringwraith",
      quantity: 1,
      pointsPerUnit: 0,
      pointsTotal: 0,
      options: source.options.map((option) => ({
        ...option,
        quantity: option.included ? 1 : 0,
      })),
    };
    expect(
      createCalculator().recalculatePointsForUnit(unit).pointsPerUnit,
    ).toBe(105);
    expect(JSON.stringify(source)).toBe(before);
  });

  it("retains corrected characteristics and magical ranges", () => {
    expect(profileData.Isengard.Crebain).toMatchObject({ D: "2", W: "3" });
    expect(profileData["Elven Kingdoms"]["Mirkwood Elf Warrior"].S).toBe("3");
    expect(
      profileData["Arnor & Angmar"]["Gulavhar, The Terror of Arnor"].Mv,
    ).toBe('12"');
    expect(
      profileData["The Free Peoples"]["Radagast the Brown"].magic_powers,
    ).toContainEqual({ name: "Nature's Wrath", range: '3"', cast: "5+" });
    const powers =
      profileData["The Misty Mountains"]["Druzhag the Beastcaller"]
        .magic_powers;
    expect(powers).toContainEqual({
      name: "Enrage Beast",
      range: '6"',
      cast: "3+",
    });
    expect(powers).toContainEqual({
      name: "Fury (Beast)",
      range: "Self",
      cast: "3+",
    });
  });

  it("retains the revised Rohan equipment and throwing limits", () => {
    expect(
      mesbgData["[army-of-edoras] haleth-prince-of-rohan"].options,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Throwing spears", points: 5 }),
      ]),
    );
    expect(
      mesbgData["[army-of-edoras] frealaf"].options.some((option) =>
        /bow/i.test(option.name),
      ),
    ).toBe(false);
    expect(mesbgData["[kingdom-of-rohan] rohan-royal-guard"].options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Horse and throwing spears",
          points: 7,
        }),
      ]),
    );
    expect(mesbgData["[fords-of-isen] theodred"].options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "Shield", included: true }),
      ]),
    );
    expect(armyListData["Fords of Isen"].throw_limit).toBe(0.5);
    expect(armyListData["Army of Thror"].throw_limit).toBe(0.5);
  });

  it.each([
    "[army-of-the-white-hand] wild-man-of-dunland",
    "[usurpers-of-edoras] hill-tribesman",
    "[beseigers-of-the-hornburg] hill-tribesman",
  ])("retains revised options in %s", (id) => {
    for (const [name, points] of [
      ["Banner", 25],
      ["Banner and light shield", 26],
      ["War horn", 25],
      ["War horn and light shield", 26],
    ]) {
      expect(mesbgData[id].options).toEqual(
        expect.arrayContaining([expect.objectContaining({ name, points })]),
      );
    }
  });

  it.each(["army-of-gothmog", "legions-of-mordor", "the-black-gate"])(
    "retains added Mordor Orc profiles in %s",
    (army) => {
      expect(mesbgData[`[${army}] mordor-orc-captain`]).toMatchObject({
        base_points: 45,
        unit_type: "Hero of Fortitude",
      });
      expect(mesbgData[`[${army}] mordor-orc-warrior`]).toMatchObject({
        base_points: 5,
        unit_type: "Warrior",
      });
    },
  );

  it.each(["buhrdur's-horde", "host-of-the-witch-king", "shadows-of-angmar"])(
    "retains the shaman's 20-point Warg in %s",
    (army) => {
      expect(mesbgData[`[${army}] angmar-orc-shaman`].options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "Warg", points: 20 }),
        ]),
      );
    },
  );

  it("keeps Legolas's shooting exceptions in both translated profiles", () => {
    for (const profile of [
      profileData["The Free Peoples"].Legolas,
      profileData["Elven Kingdoms"]["Legolas Greenleaf, Prince of Mirkwood"],
    ]) {
      const text = profile.active_or_passive_rules.find(
        (rule) => rule.name === "Deadly Shot",
      )!.description;
      expect(text).toContain(
        "if there are no other friendly models engaged in the same combat",
      );
      expect(text).toContain("so long as he has the Infantry keyword");
      const spanish = translateGameText("es", text);
      expect(spanish).toContain("Infantería");
      expect(spanish).toContain("-1");
      expect(spanish).toMatch(/línea de visión/i);
    }
  });
});
