import { mesbgData, profileData } from "../../assets/data";

export type ProfileAlignment = "Good" | "Evil" | "Shared" | "Unknown";
type Side = "Good" | "Evil";

const sidesByProfile = new Map<string, Set<Side>>();
const sidesByOrigin = new Map<string, Set<Side>>();
const key = (origin: string, name: string) => JSON.stringify([origin, name]);
function add(map: Map<string, Set<Side>>, id: string, side: Side) {
  if (!map.has(id)) map.set(id, new Set());
  map.get(id)!.add(side);
}

// A source book can contain both sides (e.g. Arnor & Angmar). Use army
// membership, including legacy lists, rather than guessing from book names.
for (const unit of Object.values(mesbgData)) {
  const side: Side = unit.army_type.startsWith("Good") ? "Good" : "Evil";
  add(sidesByProfile, key(unit.profile_origin, unit.name), side);
  add(sidesByOrigin, unit.profile_origin, side);
  // Some riders include their mount in base equipment instead of an option.
  const gear = profileData[unit.profile_origin]?.[unit.name]?.wargear || [];
  for (const mount of Object.keys(profileData.Mounts)) {
    if (gear.some((item) => item.toLowerCase() === mount.toLowerCase()))
      add(sidesByProfile, key("Mounts", mount), side);
  }
  for (const option of unit.options) {
    if (option.mount_name && profileData.Mounts[option.mount_name])
      add(sidesByProfile, key("Mounts", option.mount_name), side);
  }
}

export function profileAlignment(
  origin: string,
  name: string,
): ProfileAlignment {
  if (origin === "Siege Equipment") return "Shared";
  const sides = sidesByProfile.get(key(origin, name));
  if (sides?.size === 1) return [...sides][0];
  if (sides && sides.size > 1) return "Shared";
  // Unlisted alternate forms may inherit an unambiguous book affiliation.
  const originSides = sidesByOrigin.get(origin);
  if (originSides?.size === 1) return [...originSides][0];
  return "Unknown";
}
