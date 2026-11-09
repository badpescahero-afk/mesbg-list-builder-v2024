import { mesbgData, profileData } from "../../../assets/data.ts";
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
  points: number | null;
  quantity: number | null;
  reference?: boolean;
  options: Option[];
  profiles: Profile[];
};

/** Catalogue view: no army/loadout is implied, so no configured cost is guessed. */
export function referenceCard(
  origin: string,
  name: string,
): ConfiguredCard | null {
  const catalogue = profileData[origin];
  if (!catalogue) return null;
  let raw = catalogue[name];
  if (!raw) {
    const find = (profiles: Profile[]): Profile | undefined => {
      for (const profile of profiles) {
        if (profile.name === name) return profile;
        const nested = find(profile.additional_stats || []);
        if (nested) return nested;
      }
    };
    raw = find(
      Object.values(catalogue).flatMap(
        (profile) => profile.additional_stats || [],
      ),
    );
  }
  if (!raw) return null;
  const candidates = Object.values(mesbgData).filter(
    (unit) => unit.profile_origin === origin,
  );
  const withResources = (profile: Profile): Profile => {
    const values = [
      ...new Set(
        candidates.flatMap((unit) =>
          unit.MWFW.filter(
            ([n]) =>
              n === profile.name ||
              (unit.name === profile.name && unit.MWFW.length === 1),
          ).map(([, value]) => value),
        ),
      ),
    ];
    const [HM, HW, HF] =
      values.length === 1
        ? values[0].split(":")
        : values.length > 1
          ? ["*", "*", "*"]
          : [];
    return {
      ...profile,
      HM,
      HW,
      HF,
      additional_stats: profile.additional_stats?.map(withResources),
    };
  };
  return {
    key: `reference:${origin}:${name}`,
    name,
    origin,
    army: "",
    modelId: "",
    points: null,
    quantity: null,
    reference: true,
    options: [],
    profiles: [withResources({ ...structuredClone(raw), name })],
  };
}

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
    .filter((unit) => !!unit && isSelectedUnit(unit)) as SelectedUnit[]) {
    const card = isSiegeEquipment(unit)
      ? (() => {
          const reference = referenceCard(unit.profile_origin, unit.name);
          return (
            reference && {
              ...reference,
              reference: false,
              modelId: unit.model_id,
              points: unit.base_points,
              quantity: 1,
            }
          );
        })()
      : configuredCardForUnit(unit);
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
