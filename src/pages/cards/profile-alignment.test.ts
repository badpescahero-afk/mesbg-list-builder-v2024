import { expect, it } from "vitest";
import { mesbgData, profileData } from "../../assets/data";
import { profileAlignment } from "./profile-alignment";

it("distinguishes opposing sides in the same source book", () => {
  expect(profileAlignment("Arnor & Angmar", "Aranarth")).toBe("Good");
  expect(profileAlignment("Arnor & Angmar", "Angmar Orc Captain")).toBe("Evil");
});

it("resolves every army membership without changing source data", () => {
  const before = JSON.stringify([mesbgData, profileData]);
  for (const unit of Object.values(mesbgData)) {
    const alignment = profileAlignment(unit.profile_origin, unit.name);
    expect([
      unit.army_type.startsWith("Good") ? "Good" : "Evil",
      "Shared",
    ]).toContain(alignment);
  }
  expect(JSON.stringify([mesbgData, profileData])).toBe(before);
});

it("keeps shared equipment and ambiguous profiles neutral", () => {
  expect(profileAlignment("Mounts", "Horse")).toBe("Shared");
  expect(profileAlignment("Mounts", "Shadowfax")).toBe("Good");
  expect(profileAlignment("Mounts", "Fell Beast")).toBe("Evil");
  for (const mount of [
    "Pony",
    "Spectral Steed",
    "Galadhrim Steed",
    "War Goat",
    "Feralof",
  ])
    expect(profileAlignment("Mounts", mount)).toBe("Good");
  expect(profileAlignment("Siege Equipment", "Siege Ladder")).toBe("Shared");
  expect(profileAlignment("Unknown book", "Unknown profile")).toBe("Unknown");
});
