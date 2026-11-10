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

  it("distinguishes Helm's character name from his ability and uses Control for Compel", () => {
    expect(translateGameText("es", "Helm Hammerhand")).toBe(
      "Helm Mano de Martillo",
    );
    expect(translateGameText("es", "Helm Hammerhand, King of Rohan")).toBe(
      "Helm Mano de Martillo, rey de Rohan",
    );
    expect(
      translateGameText("es", "Helm Hammerhand, Wraith of the Hornburg"),
    ).toBe("Helm Mano de Martillo, espectro de Cuernavilla");
    expect(translateGameText("es", "The Hammerhand")).toBe("Manomartillo");
    expect(translateGameText("es", "Compel")).toBe("Control");
    expect(translateGameText("en", "Helm Hammerhand")).toBe("Helm Hammerhand");
    expect(translateGameText("en", "The Hammerhand")).toBe("The Hammerhand");
    expect(translateGameText("en", "Compel")).toBe("Compel");
  });

  it("keeps spell effects under the correct heading across the PDF columns", () => {
    // Visual check: Reglamento pp. 117 and 120, part 11 pp. 25 and 28.
    // Plain extraction interleaves these columns; nearby headings are not owners.
    const explanation = (name: string) =>
      translateGameText(
        "es",
        keywords.find((rule) => rule.name === name)!.description,
      );
    expect(explanation("Call Winds")).toContain('D3+3"');
    expect(explanation("Call Winds")).not.toContain("pruebas de Coraje");
    expect(explanation("Aura of Dismay")).toContain("pruebas de Coraje");
    expect(explanation("Aura of Dismay")).not.toContain("D3+3");
    expect(explanation("Renew")).toContain("1 Herida perdida");
    expect(explanation("Terrifying Aura")).toContain("regla Terror");
    expect(explanation("Transfix")).toContain("Hasta la fase final del turno");
    expect(explanation("Transfix")).toContain("no puede efectuar golpes");
  });

  it("clarifies the three agreed spell scopes without rewriting English rules", () => {
    const before = JSON.stringify(keywords);
    const explanation = (name: string) => {
      const source = keywords.find((rule) => rule.name === name)!.description;
      expect(translateGameText("en", source)).toBe(source);
      return translateGameText("es", source);
    };
    const paralyse = explanation("Paralyse");
    expect(paralyse).toContain("aunque su bando gane el duelo");
    expect(paralyse).toContain(
      "Las miniaturas aliadas que no estén paralizadas pueden efectuar sus golpes normalmente",
    );
    expect(paralyse).not.toContain("si pierde el duelo");
    expect(explanation("Compel")).toContain(
      "ni tumbarla, ni permitirle u obligarla a desmontar",
    );
    expect(explanation("Protection of the Valar")).toContain(
      "objetivo de un ataque de disparo",
    );
    expect(explanation("Protection of the Valar")).toContain(
      "-1 a su tirada para impactar",
    );
    expect(JSON.stringify(keywords)).toBe(before);
  });
});
