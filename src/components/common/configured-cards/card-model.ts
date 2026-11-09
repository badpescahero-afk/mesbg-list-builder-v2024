import { profileData } from "../../../assets/data.ts";
import { Profile } from "../../../hooks/profiles/profile-utils/profile.type.ts";
import {
  isMissingProfile,
  transformUnitToListOfProfiles,
} from "../../../hooks/profiles/profile-utils/profiles.ts";
import { Option } from "../../../types/mesbg-data.types.ts";
import { Stats } from "../../../types/profile-data.types.ts";
import {
  isSelectedUnit,
  isSiegeEquipment,
  Roster,
  SelectedUnit,
} from "../../../types/roster.ts";

export const STAT_KEYS: (keyof Stats)[] = [
  "Mv",
  "Fv",
  "Sv",
  "S",
  "D",
  "A",
  "W",
  "C",
  "I",
];

export type ConfiguredCard = {
  key: string;
  name: string;
  origin: string;
  army: string;
  modelId: string;
  points: number;
  quantity: number;
  options: Option[];
  profiles: Profile[];
};

/** One immutable snapshot per model/loadout. Never merge different equipment. */
export function configuredCardForUnit(
  source: SelectedUnit,
): ConfiguredCard | null {
  const raw = profileData[source.profile_origin]?.[source.name];
  if (!raw) return null;
  const unit = structuredClone(source);
  // The existing transformer has a legacy Ringwraith branch that assigns A.
  // Supplying a snapshot keeps that assignment away from shared profile data.
  const result = transformUnitToListOfProfiles(unit, structuredClone(raw));
  if (isMissingProfile(result) || result.length === 0) return null;
  const profiles = result.map((profile) => {
    const additional = [...(profile.additional_stats || [])];
    const variant = additional[0];
    // The PDF transformer puts a warrior's equipment modifiers in an extra row.
    // On a card for that specific loadout, show that row as the primary stats.
    if (!unit.unique && variant?.name.startsWith("with ")) {
      const corrected = Object.fromEntries(
        STAT_KEYS.map((key) => [key, variant[key]]),
      );
      return {
        ...profile,
        ...corrected,
        additional_stats: additional.slice(1),
      };
    }
    return profile;
  });
  const options = unit.options.filter((option) => option.quantity > 0);
  // Combined options (e.g. Horse and throwing spears) declare their mount by
  // mount_name. Resolve that explicit reference; do not infer equipment effects.
  for (const option of options) {
    if (
      !option.type
        ?.split(",")
        .map((part) => part.trim())
        .includes("mount") ||
      !option.mount_name
    )
      continue;
    const mount = profileData.Mounts[option.mount_name];
    if (
      mount &&
      !profiles[0].additional_stats?.some(
        (profile) => profile.name === option.mount_name,
      )
    ) {
      profiles[0].additional_stats = [
        ...(profiles[0].additional_stats || []),
        { ...structuredClone(mount), name: option.mount_name, type: "mount" },
      ];
    }
  }
  const key = JSON.stringify([
    unit.model_id,
    unit.profile_origin,
    unit.name,
    unit.pointsPerUnit,
    options
      .map((option) => [option.id, option.name, option.quantity])
      .sort((a, b) => String(a[0]).localeCompare(String(b[0]))),
    profiles,
  ]);
  return {
    key,
    name: unit.name,
    origin: unit.profile_origin,
    army: unit.army_list,
    modelId: unit.model_id,
    points: unit.pointsPerUnit,
    quantity: unit.quantity,
    options,
    profiles,
  };
}

export function configuredCardsForRoster(roster: Roster) {
  const grouped = new Map<string, ConfiguredCard>();
  const missing: string[] = [];
  for (const unit of roster.warbands
    .flatMap((warband) => [warband.hero, ...warband.units])
    .filter(
      (unit) => !!unit && isSelectedUnit(unit) && !isSiegeEquipment(unit),
    ) as SelectedUnit[]) {
    const card = configuredCardForUnit(unit);
    if (!card) {
      missing.push(`${unit.profile_origin}: ${unit.name}`);
      continue;
    }
    const existing = grouped.get(card.key);
    if (existing) existing.quantity += card.quantity;
    else grouped.set(card.key, card);
  }
  return { cards: [...grouped.values()], missing: [...new Set(missing)] };
}
