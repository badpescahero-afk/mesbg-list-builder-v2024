import { describe, expect, it } from "vitest";
import glossary from "../../docs/glosario-revisado-es.json";
import keywords from "../assets/data/keywords.json";
import { translateGameText } from "./game-text";

describe("terminology checked against the supplied reference", () => {
  it("uses reviewed names throughout the merged catalogue, with English intact", () => {
    for (const entry of glossary) {
      expect(translateGameText("es", entry.source), entry.source).toBe(
        entry.target,
      );
      expect(translateGameText("en", entry.source)).toBe(entry.source);
    }
  });

  it("distinguishes the two shooting rules and the two blade spells", () => {
    expect(translateGameText("es", "Expert Shot")).toBe("Tirador experto");
    expect(translateGameText("es", "Sharpshooter")).toBe("Tirador de primera");
    expect(translateGameText("es", "Bladewrath")).toBe("Filos encantados");
    expect(translateGameText("es", "Enchant Blades")).toBe("Encantar espadas");
    const explanation = (name: string) =>
      translateGameText(
        "es",
        keywords.find((rule) => rule.name === name)!.description,
      );
    expect(explanation("Expert Shot")).toContain("dos ataques de disparo");
    expect(explanation("Sharpshooter")).toContain(
      "elegir como objetivo al jinete o a la montura",
    );
  });

  it("retains parameters when resolving renamed general rules", () => {
    expect(translateGameText("es", "Sworn Protector (Thranduil)")).toBe(
      "Protector jurado (Thranduil)",
    );
    expect(translateGameText("es", "Master of Battle (3+)")).toBe(
      "Maestro de batalla (3+)",
    );
  });
});
