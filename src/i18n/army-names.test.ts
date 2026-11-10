import { describe, expect, it } from "vitest";
import armies from "../assets/data/army_list_data.json";
import profiles from "../assets/data/profile_data.json";
import { matchesArmySearch, translateArmyNames } from "./army-names";
import terms from "./content/terms.es.json";
import { translateGameText } from "./game-text";

describe("army presentation", () => {
  it("covers every army and profile origin without changing canonical data", () => {
    const before = JSON.stringify(armies);
    const unchanged = new Set([
      "Arnor",
      "Cirith Ungol",
      "Fangorn",
      "Harad",
      "Lindon",
      "Minas Morgul",
      "Minas Tirith",
      "Moria",
      "Umbar",
      "Rohan",
      "Isengard",
      "Mordor",
      "Gondor",
      "Smaug",
    ]);
    for (const name of [...Object.keys(armies), ...Object.keys(profiles)]) {
      expect(Object.prototype.hasOwnProperty.call(terms, name), name).toBe(
        true,
      );
      expect(translateGameText("en", name)).toBe(name);
      if (!unchanged.has(name))
        expect(translateGameText("es", name), name).not.toBe(name);
    }
    expect(JSON.stringify(armies)).toBe(before);
  });
  it("finds canonical and translated names, ignoring case and accents", () => {
    for (const query of ["Atop", "sobre las murallas", "MURALLAS"]) {
      expect(matchesArmySearch("es", "Atop the Walls", query)).toBe(true);
    }
    expect(matchesArmySearch("es", "Riders of Theoden", "theoden")).toBe(true);
    expect(matchesArmySearch("es", "The Eagles", "aguilas")).toBe(true);
    expect(matchesArmySearch("es", "Atop the Walls", "Mordor")).toBe(false);
  });
  it("translates allied army labels while preserving English and unknown names", () => {
    expect(translateArmyNames("es", "The Fellowship, Rivendell")).toBe(
      "La Compañía del Anillo, Rivendel",
    );
    expect(translateArmyNames("en", "The Fellowship, Rivendell")).toBe(
      "The Fellowship, Rivendell",
    );
    expect(translateArmyNames("es", "Future Army")).toBe("Future Army");
  });
});
