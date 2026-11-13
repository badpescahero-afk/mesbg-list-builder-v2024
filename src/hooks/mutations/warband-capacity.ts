import { Warband } from "../../types/roster";

// Receive recalculated metadata from the existing calculator. Do not duplicate
// its rules for passengers, siege crews, free followers or special leaders.
export function exceedsWarbandCapacity(
  previous: Warband | undefined,
  next: Warband,
): boolean {
  const maximum = next.meta.maxUnits;
  if (maximum === "-" || next.meta.units <= maximum) return false;
  if (!previous) return true;
  const previousMaximum = previous.meta.maxUnits;
  const previousOverflow =
    previousMaximum === "-"
      ? 0
      : Math.max(0, previous.meta.units - previousMaximum);
  // Existing overfull rosters stay editable: reductions and equipment changes
  // are allowed, but neither the count nor the excess may increase.
  return (
    next.meta.units > previous.meta.units ||
    next.meta.units - maximum > previousOverflow
  );
}

export function hasWarbandCapacityViolation(
  previous: Warband[],
  next: Warband[],
): boolean {
  return next.some((warband) =>
    exceedsWarbandCapacity(
      previous.find((old) => old.id === warband.id),
      warband,
    ),
  );
}
