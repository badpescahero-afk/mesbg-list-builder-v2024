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

  it("works when browser storage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new Error("blocked");
      },
    });
    expect(readLanguage()).toBe(DEFAULT_LANGUAGE);
  });
});
