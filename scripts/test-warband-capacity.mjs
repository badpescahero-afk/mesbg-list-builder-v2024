/* eslint-env node, es2021 */
// Run with: node scripts/test-warband-capacity.mjs
// A bounded browser test: Vite runs in a child process with a log and is stopped
// in finally. No existing server or browser storage is reused.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { openSync, closeSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { chromium } from "playwright";

const directory = mkdtempSync(join(tmpdir(), "mesbg-capacity-"));
const logPath = join(directory, "vite.log");
const log = openSync(logPath, "w");
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "5205",
    "--strictPort",
  ],
  {
    stdio: ["ignore", log, log],
    // Reproduce the version variable supplied by the real npm start script.
    env: {
      ...process.env,
      npm_package_version: JSON.parse(readFileSync("package.json", "utf8"))
        .version,
    },
  },
);
closeSync(log);
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, `Vite exited: ${logPath}`);
    try {
      const response = await fetch("http://127.0.0.1:5205", {
        signal: AbortSignal.timeout(1000),
      });
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for this test's server to start. */
    }
    await setTimeout(100);
  }
  assert.ok(ready, `Vite startup timeout: ${logPath}`);
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5205/rosters");
  const seed = async (quantity) => {
    await page.evaluate(async (quantity) => {
      const { mesbgData } = await import("/src/assets/data.ts");
      const { useCalculator } = await import(
        "/src/hooks/calculations-and-displays/useCalculator.ts"
      );
      const { emptyRoster, emptyWarband } = await import(
        "/src/state/roster-building/roster/index.ts"
      );
      const { useRosterBuildingState } = await import(
        "/src/state/roster-building/index.ts"
      );
      const calc = useCalculator();
      const selected = (id, quantity) =>
        calc.recalculatePointsForUnit({
          ...structuredClone(mesbgData[id]),
          id,
          quantity,
        });
      const hero = selected(
        "[army-of-edoras] helm-hammerhand-king-of-rohan",
        1,
      );
      const roster = calc.recalculateRoster({
        ...structuredClone(emptyRoster),
        id: "capacity-test",
        name: "Prueba límite Helm",
        armyList: "Army of Edoras",
        warbands: [
          calc.recalculateWarband({
            ...emptyWarband,
            id: "helm-warband",
            hero,
            units: [selected("[army-of-edoras] rider-of-rohan", quantity)],
          }),
        ],
      });
      useRosterBuildingState.setState({ rosters: [roster] });
    }, quantity);
    await page.goto("http://127.0.0.1:5205/roster/capacity-test");
    await page
      .getByText("Helm Manomartillo, rey de Rohan", { exact: true })
      .waitFor();
  };
  const getSaved = () =>
    page.evaluate(
      () => JSON.parse(localStorage.getItem("mlb-rosters")).state.rosters[0],
    );
  const increment = page.locator(
    '[data-test-id="quantity--increment--w1-i1"]:visible',
  );
  const decrement = page.locator(
    '[data-test-id="quantity--decrement--w1-i1"]:visible',
  );
  await seed(17);
  assert.equal(await increment.isEnabled(), true);
  await increment.click();
  assert.equal((await getSaved()).warbands[0].meta.units, 18);
  assert.equal(await increment.isDisabled(), true);
  const full = JSON.stringify(await getSaved());
  await page.locator('[data-test-id="duplicate-unit--w1-i1"]:visible').click();
  await page
    .getByText("Límite de compañía alcanzado", { exact: true })
    .waitFor();
  assert.equal(JSON.stringify(await getSaved()), full);
  await page.locator('[data-test-id="warband-1--add-unit"]').click();
  const drawer = page.locator(".MuiDrawer-root.MuiModal-root .MuiDrawer-paper");
  await drawer
    .locator("#hero-selection-list--name-filter")
    .fill("Rider of Rohan");
  const withPlaceholder = JSON.stringify(await getSaved());
  await drawer
    .locator(".MuiPaper-elevation3")
    .filter({ hasText: "Rider of Rohan" })
    .first()
    .click();
  assert.equal(JSON.stringify(await getSaved()), withPlaceholder);
  assert.equal(await drawer.isVisible(), true);
  await drawer.locator('button:has([data-testid="CloseIcon"])').click();
  await page.screenshot({
    path: join(directory, "helm-full-mobile.png"),
    fullPage: true,
  });
  // Previously saved overfull lists survive reload and remain correctable.
  await seed(19);
  assert.equal((await getSaved()).warbands[0].meta.units, 19);
  assert.equal(await increment.isDisabled(), true);
  await decrement.click();
  assert.equal((await getSaved()).warbands[0].meta.units, 18);
  await page.reload();
  await page
    .getByText("Helm Manomartillo, rey de Rohan", { exact: true })
    .waitFor();
  assert.equal((await getSaved()).warbands[0].meta.units, 18);
  assert.equal(await increment.isDisabled(), true);
  await decrement.click();
  assert.equal(await increment.isEnabled(), true);
  await increment.click();
  const originalStats = (await getSaved()).warbands[0];
  await page.locator("#interface-language").click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  assert.deepEqual((await getSaved()).warbands[0], originalStats);
  await page.setViewportSize({ width: 1280, height: 900 });
  assert.equal(await increment.isDisabled(), true);
  await page.locator('[data-test-id="duplicate-unit--w1-i1"]:visible').click();
  await page.getByText("Warband limit reached", { exact: true }).waitFor();
  assert.deepEqual((await getSaved()).warbands[0], originalStats);
  await page.screenshot({
    path: join(directory, "helm-full-desktop.png"),
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    `PASS: Helm cannot exceed 18 by increment, duplicate or picker; ES/EN mobile/desktop; existing 19 preserved then reduced; reload persists. Artifacts: ${directory}`,
  );
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill("SIGTERM");
    const killTimer = globalThis.setTimeout(() => server.kill("SIGKILL"), 5000);
    await stopped;
    clearTimeout(killTimer);
  }
  console.log(`Vite stopped. Log: ${logPath}`);
}
