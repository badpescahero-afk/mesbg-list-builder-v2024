import { expect, it } from "vitest";
import { charts } from "../constants/charts";
import content from "./content/charts.es.json";

it("covers every original image chart with complete, rectangular Spanish tables", () => {
  expect(Object.keys(content).sort()).toEqual(
    Object.keys(charts)
      .filter((id) => id !== "to-wound-chart")
      .sort(),
  );
  for (const chart of Object.values(content)) {
    for (const row of chart.rows)
      expect(row).toHaveLength(chart.columns.length);
  }
});

it("preserves every dice band, including the distinct sentry control results", () => {
  for (const [id, chart] of Object.entries(content)) {
    if (chart.columns[0] !== "D6") continue;
    expect(
      chart.rows.map((row) => row[0]),
      id,
    ).toEqual(
      id === "sentry-chart" ? ["1", "2-3", "4-5", "6"] : ["1", "2-5", "6"],
    );
  }
  expect(content["sentry-chart"].rows[1][1]).toContain("jugador contrario");
  expect(content["sentry-chart"].rows[2][1]).toContain(
    "jugador que lo controla",
  );
});

// Transcribed independently from the existing English chart images.
it("preserves the fifteen weapon ranges and strengths and seven door profiles", () => {
  expect(
    content["missile-weapon-chart"].rows.map((row) => row.slice(1)),
  ).toEqual([
    ["12″", "2"],
    ["24″", "2"],
    ["24″", "4"],
    ["18″", "3"],
    ["24″", "3"],
    ["24″", "3"],
    ["24″", "3"],
    ["24″", "4"],
    ["24″", "3"],
    ["18″", "2"],
    ["18″", "2"],
    ["12″", "1"],
    ["8″", "3"],
    ["6″", "3"],
    ["18″", "3"],
  ]);
  expect(
    content["siege-gates-and-doors"].rows.map((row) => row.slice(1)),
  ).toEqual([
    ["10", "3"],
    ["9", "3"],
    ["9", "2"],
    ["8", "2"],
    ["7", "2"],
    ["6", "2"],
    ["5", "1"],
  ]);
});
