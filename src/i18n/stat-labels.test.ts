import { expect, it } from "vitest";
import { statLabel } from "./stat-labels";

it("disambiguates wounds, will, strength and fate without changing English headers", () => {
  expect(
    (["W", "HW", "S", "HF"] as const).map((key) => statLabel("es", key)),
  ).toEqual(["H", "V", "F", "D"]);
  expect(statLabel("es", "Fv", true)).toBe("Combate");
  expect(statLabel("es", "C", true)).toBe("Coraje");
  expect(statLabel("es", "D", true)).toBe("Defensa");
  expect(statLabel("es", "HF", true)).toBe("Destino");
  expect(statLabel("en", "W")).toBe("W");
  expect(statLabel("en", "HW")).toBe("W");
  expect(statLabel("en", "S")).toBe("S");
  expect(statLabel("en", "HF")).toBe("F");
});
