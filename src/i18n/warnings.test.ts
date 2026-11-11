import { describe, expect, it } from "vitest";
import warnings from "../assets/data/warning_rules.json";
import { translateWarning } from "./warnings";
import { spanishWarnings } from "./warnings.es";

describe("original stats and localised warnings", () => {
  it("covers every data-driven warning without changing any source rule", () => {
    const before = JSON.stringify(warnings);
    for (const rules of Object.values(warnings)) {
      for (const rule of rules) {
        expect(
          Object.prototype.hasOwnProperty.call(spanishWarnings, rule.warning),
          rule.warning,
        ).toBe(true);
        expect(translateWarning("es", rule.warning)).not.toBe(rule.warning);
        expect(translateWarning("en", rule.warning)).toBe(rule.warning);
      }
    }
    expect(JSON.stringify(warnings)).toBe(before);
  });

  it("keeps names, values and rule limits in dynamic validation messages", () => {
    expect(
      translateWarning(
        "es",
        "This Army may not include more Goblin models than Orc models. Currently counting 12 Orcs and 15 Goblins.",
      ),
    ).toBe(
      "El ejército no puede incluir más Trasgos que Orcos. Actualmente hay 12 Orcos y 15 Trasgos.",
    );
    expect(
      translateWarning(
        "es",
        "Warbands without a hero require 10 to 12 models. Warband 3 is outside this range.",
      ),
    ).toBe(
      "Las compañías sin héroe necesitan entre 10 y 12 miniaturas. La compañía 3 está fuera de ese intervalo.",
    );
    const rule =
      "Only 33% of this army can have the Lothlórien keyword. The current roster has 38.5% models with the Lothlórien keyword";
    expect(translateWarning("es", rule)).toContain("33%");
    expect(translateWarning("es", rule)).toContain("38.5%");
    expect(translateWarning("en", rule)).toBe(rule);
    expect(translateWarning("es", "Unknown future rule")).toBe(
      "Unknown future rule",
    );
  });
});
