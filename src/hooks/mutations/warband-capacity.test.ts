import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { beforeEach, expect, it, vi } from "vitest";
import { mesbgData, siegeEquipmentData } from "../../assets/data";
import { AlertTypes } from "../../components/notifications/alert-types";
import { useAppState } from "../../state/app";
import { useRosterBuildingState } from "../../state/roster-building";
import { emptyRoster, emptyWarband } from "../../state/roster-building/roster";
import { Roster, SelectedUnit, Warband } from "../../types/roster";
import { useCalculator } from "../calculations-and-displays/useCalculator";
import { useRosterSorting } from "./useRosterSorting";
import { useWarbandMutations } from "./useWarbandMutations";
import { exceedsWarbandCapacity } from "./warband-capacity";

vi.hoisted(() => {
  const saved = new Map<string, string>();
  const localStorage = {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
    removeItem: (key: string) => saved.delete(key),
  };
  vi.stubGlobal("localStorage", localStorage);
  vi.stubGlobal("window", {
    localStorage,
    matchMedia: () => ({ matches: false }),
  });
});

// SSR normally reads Zustand's initial snapshot; read the live store so each
// rendered hook observes the fixture and the preceding mutation.
vi.mock("../../state/roster-building", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../../state/roster-building")>();
  return {
    ...actual,
    useRosterBuildingState: Object.assign(
      (selector) =>
        selector
          ? selector(actual.useRosterBuildingState.getState())
          : actual.useRosterBuildingState.getState(),
      actual.useRosterBuildingState,
    ),
  };
});

vi.mock("../cloud-sync/RosterCloudSyncProvider.tsx", () => ({
  useRosterSync: () => ({ sync: vi.fn() }),
}));
vi.mock("../calculations-and-displays/useRosterInformation.ts", () => ({
  useRosterInformation: () => ({
    roster: useRosterBuildingState.getState().rosters[0],
  }),
}));
let calc: ReturnType<typeof useCalculator>;
function CalculatorHarness() {
  calc = useCalculator();
  return null;
}
renderToString(createElement(CalculatorHarness));
const helm = "[army-of-edoras] helm-hammerhand-king-of-rohan";
const rider = "[army-of-edoras] rider-of-rohan";
function selected(id: string, quantity = 1): SelectedUnit {
  expect(mesbgData[id], id).toBeDefined();
  return calc.recalculatePointsForUnit({
    ...structuredClone(mesbgData[id]),
    id,
    quantity,
    pointsPerUnit: 0,
    pointsTotal: 0,
  });
}
function wb(
  hero = selected(helm),
  units = [selected(rider, 18)],
  id = "wb1",
): Warband {
  return calc.recalculateWarband({ ...emptyWarband, id, hero, units });
}
function seed(warbands: Warband[]) {
  const roster = calc.recalculateRoster({
    ...structuredClone(emptyRoster),
    id: "test-roster",
    name: "Saved roster",
    armyList: "Army of Edoras",
    warbands,
  });
  useRosterBuildingState.setState({ rosters: [roster] });
  return roster;
}
function current(): Roster {
  return useRosterBuildingState.getState().rosters[0];
}
function mutations() {
  let result: ReturnType<typeof useWarbandMutations>;
  function Harness() {
    result = useWarbandMutations("test-roster", "wb1");
    return null;
  }
  renderToString(createElement(Harness));
  return result;
}
function move() {
  let result: ReturnType<typeof useRosterSorting>;
  function Harness() {
    result = useRosterSorting();
    return null;
  }
  renderToString(createElement(Harness));
  result.onUnitDropped({
    source: { droppableId: "wb2", index: 0 },
    destination: { droppableId: "wb1", index: 1 },
    type: "unit",
    draggableId: rider,
    reason: "DROP",
    mode: "FLUID",
    combine: null,
  });
}
beforeEach(() => {
  useAppState.setState({ activeAlerts: [] });
});

it("blocks Helm's 19th rider and duplication without mutating the saved roster", () => {
  const before = seed([wb()]);
  const original = JSON.stringify(before);
  expect(mutations().updateUnit(selected(rider, 19))).toBe(false);
  mutations().duplicateUnit(rider);
  expect(JSON.stringify(current())).toBe(original);
  expect(useAppState.getState().activeAlerts.map((a) => a.type)).toEqual([
    AlertTypes.WARBAND_CAPACITY_EXCEEDED,
    AlertTypes.WARBAND_CAPACITY_EXCEEDED,
  ]);
});

it("permits the 18th rider and reductions of a previously saved overfull roster", () => {
  seed([wb(selected(helm), [selected(rider, 17)])]);
  expect(mutations().updateUnit(selected(rider, 18))).toBe(true);
  expect(current().warbands[0].meta.units).toBe(18);
  seed([wb(selected(helm), [selected(rider, 20)])]);
  expect(mutations().updateUnit(selected(rider, 19))).toBe(true);
  expect(mutations().updateUnit(selected(rider, 20))).toBe(false);
  const equipped = selected(rider, 19);
  equipped.options[0].quantity = 1;
  expect(mutations().updateUnit(calc.recalculatePointsForUnit(equipped))).toBe(
    true,
  );
  expect(mutations().updateUnit(selected(rider, 18))).toBe(true);
});

it("blocks picker replacement and a hero with lower capacity, but keeps empty placeholders editable", () => {
  const initial = wb();
  initial.units.push({ id: "empty" });
  seed([initial]);
  const before = JSON.stringify(current());
  expect(mutations().handleUnitSelection("empty", mesbgData[rider])).toBe(
    false,
  );
  expect(
    mutations().handleHeroSelection(
      mesbgData["[army-of-edoras] captain-of-rohan"],
    ),
  ).toBe(false);
  expect(JSON.stringify(current())).toBe(before);
});

it("rejects a move into a full warband atomically, and allows it when one place is free", () => {
  seed([
    wb(),
    wb(selected("[army-of-edoras] captain-of-rohan"), [selected(rider)], "wb2"),
  ]);
  const before = JSON.stringify(current());
  move();
  expect(JSON.stringify(current())).toBe(before);
  mutations().updateUnit(selected(rider, 17));
  move();
  expect(current().warbands.map((w) => w.meta.units)).toEqual([18, 0]);
});

it("uses the original special counts for crews, passengers and free followers", () => {
  const sarumanId = Object.keys(mesbgData).find(
    (id) => mesbgData[id].name === "Saruman",
  );
  const grimaId = Object.keys(mesbgData).find(
    (id) => mesbgData[id].name === "Grima",
  );
  const before = wb(selected(sarumanId));
  const after = calc.recalculateWarband({
    ...before,
    units: [...before.units, selected(grimaId)],
  });
  expect(after.meta.units).toBe(before.meta.units);
  expect(exceedsWarbandCapacity(before, after)).toBe(false);

  const tree = selected("[fangorn] treebeard");
  const treeBefore = wb(tree);
  const passenger = tree.options.find((o) => o.type === "passenger");
  passenger.quantity = 1;
  const treeAfter = wb(tree);
  expect(treeAfter.meta.units).toBe(18 + passenger.passengers);
  expect(exceedsWarbandCapacity(treeBefore, treeAfter)).toBe(true);

  const engine = selected("[minas-tirith] gondor-avenger-bolt-thrower");
  const siegeBefore = wb(engine, [selected(rider, 4)]);
  expect(siegeBefore.meta.units).toBe(6);
  expect(
    exceedsWarbandCapacity(siegeBefore, wb(engine, [selected(rider, 5)])),
  ).toBe(true);

  const equipment = Object.values(siegeEquipmentData)[0];
  const selectedEquipment = {
    ...equipment,
    id: "equipment",
    quantity: 1,
    options: [],
    MWFW: [],
    pointsTotal: equipment.base_points,
  };
  const withEquipment = calc.recalculateWarband({
    ...before,
    units: [...before.units, selectedEquipment],
  });
  expect(withEquipment.meta.units).toBe(before.meta.units);
  expect(exceedsWarbandCapacity(before, withEquipment)).toBe(false);
});

it("handles counted captains, zero capacities and unassigned heroes", () => {
  const captain = selected("[the-spider-queens-brood] bat-swarm-cpt");
  const before = wb(captain, [selected(rider, captain.warband_size - 1)]);
  expect(before.meta.units).toBe(captain.warband_size);
  expect(
    exceedsWarbandCapacity(
      before,
      wb(captain, [selected(rider, captain.warband_size)]),
    ),
  ).toBe(true);
  const independentId = Object.keys(mesbgData).find(
    (id) =>
      mesbgData[id].warband_size === 0 &&
      mesbgData[id].unit_type === "Independent Hero",
  );
  const independent = selected(independentId);
  expect(
    exceedsWarbandCapacity(
      wb(independent, []),
      wb(independent, [selected(rider)]),
    ),
  ).toBe(true);
  expect(exceedsWarbandCapacity(wb(null, []), wb(null))).toBe(false);
});
