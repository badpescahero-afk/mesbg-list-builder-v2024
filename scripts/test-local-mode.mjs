/* eslint-env node, es2021 */
// Bounded test with an isolated persistent browser profile, including full restart.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { openSync, closeSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { chromium } from "playwright";

const directory = mkdtempSync(join(tmpdir(), "mesbg-local-"));
const log = openSync(join(directory, "vite.log"), "w");
const base = "http://127.0.0.1:5203";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "5203",
    "--strictPort",
  ],
  {
    stdio: ["ignore", log, log],
    // Local mode must prevail over leftover deployment configuration.
    env: {
      ...process.env,
      VITE_FIREBASE_API_KEY: "local-mode-test",
      VITE_FIREBASE_APP_ID: "local-mode-test",
      VITE_FIREBASE_MESSAGE_SENDER_ID: "local-mode-test",
    },
  },
);
closeSync(log);
const errors = [];
const remoteAccountRequests = [];
let browser;
const openBrowser = async () => {
  const context = await chromium.launchPersistentContext(
    join(directory, "profile"),
    {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
      viewport: { width: 390, height: 844 },
    },
  );
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin === base) return route.continue();
    if (
      /firebase|identitytoolkit|securetoken|accounts\.google|api\.mesbg-list-builder/.test(
        url.hostname,
      )
    )
      remoteAccountRequests.push(url.hostname);
    return route.abort();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  return { context, page };
};
const readSaved = (page) =>
  page.evaluate(() =>
    Object.fromEntries(
      [
        "mlb-rosters",
        "mlb-collection",
        "mlb-gamestate",
        "mlb-matches",
        "mlb-preferences",
      ].map((key) => [key, localStorage.getItem(key)]),
    ),
  );
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    assert.equal(server.exitCode, null);
    try {
      if ((await fetch(base, { signal: AbortSignal.timeout(1000) })).ok) {
        ready = true;
        break;
      }
    } catch {
      /* Wait for our server. */
    }
    await setTimeout(100);
  }
  assert.ok(ready, "Vite startup timeout");
  let opened = await openBrowser();
  browser = opened.context;
  let page = opened.page;
  await page.goto(`${base}/rosters`);
  await page.getByText("Todavía no hay listas.", { exact: true }).waitFor();
  await page.getByText("Guardado local automático", { exact: true }).waitFor();
  assert.deepEqual(
    await page.evaluate(async () => {
      const m = await import("/src/firebase/config.ts");
      return { auth: !!m.auth, app: !!m.app };
    }),
    { auth: false, app: false },
  );
  await page
    .getByRole("button", { name: "action-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Crear lista", exact: true })
    .click();
  await page
    .getByRole("textbox", {
      name: "Nombre de la lista (opcional)",
      exact: true,
    })
    .fill("Mi lista local");
  await page
    .getByRole("combobox", { name: "Ejército", exact: true })
    .fill("Atop the Walls");
  await page
    .getByRole("option")
    .filter({ has: page.getByText("Sobre las murallas", { exact: true }) })
    .click();
  await page.locator('[data-test-id="dialog--submit-button"]').click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  // Exercise the existing mutation actions, including stores without a Save button.
  const rosterId = await page.evaluate(async () => {
    const { useRosterBuildingState } = await import(
      "/src/state/roster-building/index.ts"
    );
    const { useCollectionState } = await import(
      "/src/state/collection/index.ts"
    );
    const { useRecentGamesState } = await import(
      "/src/state/recent-games/index.ts"
    );
    const { useGameModeState } = await import("/src/state/gamemode/index.ts");
    const { useUserPreferences } = await import(
      "/src/state/preference/index.ts"
    );
    const roster = useRosterBuildingState.getState().rosters[0];
    useCollectionState
      .getState()
      .upsertInventory("Gondor", "Warrior of Minas Tirith", {
        collection: [{ options: ["Shield"], mount: "", amount: "4" }],
      });
    useRecentGamesState.getState().addGame({
      id: "local-match",
      gameDate: "2026-11-09",
      points: 200,
      result: "Won",
      tags: [],
      armies: roster.armyList,
      bows: 0,
      throwingWeapons: 0,
      victoryPoints: 5,
      opponentName: "Prueba local",
      opponentVictoryPoints: 2,
    });
    useGameModeState.getState().startNewGame(roster);
    useGameModeState.getState().updateGameState(roster.id, { casualties: 1 });
    useUserPreferences
      .getState()
      .setPreference("forceShowCardActionButtons", true);
    return roster.id;
  });
  const saved = await readSaved(page);
  for (const value of Object.values(saved)) assert.ok(value);
  assert.equal(
    JSON.parse(saved["mlb-rosters"]).state.rosters[0].metadata.points,
    200,
  );
  // Old links cannot mount login/signup forms or clear the stored data.
  for (const path of ["sign-in", "sign-up"]) {
    await page.goto(`${base}/${path}`);
    await page.waitForURL("**/rosters");
    assert.equal(await page.locator('input[type="password"]').count(), 0);
    assert.deepEqual(await readSaved(page), saved);
  }
  // Full browser shutdown, not just a reload, and rehydrate from the same profile.
  await browser.close();
  browser = undefined;
  opened = await openBrowser();
  browser = opened.context;
  page = opened.page;
  await page.goto(`${base}/roster/${rosterId}`);
  await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  assert.deepEqual(await readSaved(page), saved);
  await page.goto(`${base}/collection`);
  await page
    .getByText("Warrior of Minas Tirith", { exact: true })
    .first()
    .waitFor();
  await page.goto(`${base}/match-history`);
  await page.getByText("Prueba local", { exact: true }).waitFor();
  await page.getByText("Victoria", { exact: true }).first().waitFor();
  await page.goto(`${base}/settings`);
  await page.getByText("Guardado local automático", { exact: true }).waitFor();
  assert.deepEqual(await readSaved(page), saved);
  assert.deepEqual(remoteAccountRequests, []);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: automatic persistence of roster, collection, game, history and preferences across browser restart; old login routes preserve all data; no Firebase initialization or auth/sync requests even with deployment keys.",
  );
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill("SIGTERM");
    const timer = globalThis.setTimeout(() => server.kill("SIGKILL"), 5000);
    await stopped;
    clearTimeout(timer);
  }
  console.log(`Server stopped. Artifacts: ${directory}`);
}
