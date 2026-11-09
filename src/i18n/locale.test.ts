import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  readLanguage,
  translate,
} from "./locale";
import { spanish } from "./spanish";

afterEach(() => vi.unstubAllGlobals());

describe("interface language", () => {
  it("preserves every English source message and supplies Spanish translations", () => {
    for (const [english, translated] of Object.entries(spanish)) {
      expect(translated.trim()).not.toBe("");
      expect(translate("en", english)).toBe(english);
      expect(translate("es", english)).toBe(translated);
    }
  });

  it("keeps unknown messages and prototype property names unchanged", () => {
    for (const message of ["Unknown message", "toString", "constructor", ""]) {
      expect(translate("es", message)).toBe(message);
    }
  });

  it.each(["es", "en", "fr", null])(
    "validates the stored language %s",
    (saved) => {
      const getItem = vi.fn().mockReturnValue(saved);
      vi.stubGlobal("localStorage", { getItem });
      expect(readLanguage()).toBe(saved === "en" ? "en" : DEFAULT_LANGUAGE);
      expect(getItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY);
    },
  );

  it("interpolates user values literally without translating names or interpreting markup", () => {
    const name = "<b>Good</b> $& {{section}}";
    expect(
      translate("es", "Hide the {{section}} section on the Printable PDF.", {
        section: name,
      }),
    ).toBe(`Ocultar la sección «${name}» en el PDF imprimible.`);
    expect(translate("en", "Deleting {{count}} rosters", { count: 0 })).toBe(
      "Deleting 0 rosters",
    );
    expect(translate("es", "Deleting {{count}} rosters", { count: 2 })).toBe(
      "Eliminar 2 listas",
    );
    expect(translate("es", "Missing {{value}}", {})).toBe("Missing {{value}}");
  });

  it("keeps interpolation placeholders consistent in every translation", () => {
    const placeholders = (text: string) =>
      [...text.matchAll(/{{(\w+)}}/g)].map((match) => match[1]).sort();
    for (const [english, translated] of Object.entries(spanish)) {
      expect(placeholders(translated), english).toEqual(placeholders(english));
    }
  });

  it("works when browser storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
    });
    expect(readLanguage()).toBe(DEFAULT_LANGUAGE);
  });
});
