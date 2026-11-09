// Run with: node scripts/test-i18n.mjs
// A bounded browser test: Vite runs in a child process with a log and is stopped
// in finally. No existing server or browser storage is reused.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { openSync, closeSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { chromium } from "playwright";

const directory = mkdtempSync(join(tmpdir(), "mesbg-i18n-"));
const logPath = join(directory, "vite.log");
const log = openSync(logPath, "w");
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "5197",
    "--strictPort",
  ],
  {
    stdio: ["ignore", log, log],
  },
);
closeSync(log);
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, `Vite exited: ${logPath}`);
    try {
      const response = await fetch("http://127.0.0.1:5197", {
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
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5197/rosters");
  await page.getByText("Todavía no hay listas.", { exact: true }).waitFor();
  assert.equal(await page.locator("html").getAttribute("lang"), "es");

  // Existing creation flow still uses the original army IDs and persists lists.
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
    .fill("Mi ejército de prueba");
  await page.getByRole("combobox", { name: "Ejército", exact: true }).click();
  await page.getByRole("option").first().click();
  await page.locator('[data-test-id="dialog--submit-button"]').click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByText("Mi ejército de prueba", { exact: true })
    .first()
    .waitFor();
  const roster = await page.evaluate(() => localStorage.getItem("mlb-rosters"));
  assert.ok(JSON.parse(roster).state.rosters.length > 0);

  console.log("PASS: Spanish roster creation and storage");
  async function switchLanguage(label, option) {
    await page
      .getByRole("combobox", { name: new RegExp(`^${label}(?:\\s|$)`) })
      .click();
    await page.getByRole("option", { name: option, exact: true }).click();
  }
  await page.goto("http://127.0.0.1:5197/rosters");
  await page
    .getByRole("heading", { name: "Mis listas", exact: true })
    .waitFor();
  await switchLanguage("Idioma", "English");
  await page
    .getByRole("heading", { name: "My Rosters", exact: true })
    .waitFor();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    roster,
  );
  await page.reload();
  await page
    .getByRole("heading", { name: "My Rosters", exact: true })
    .waitFor();
  await page
    .getByText("Mi ejército de prueba", { exact: true })
    .first()
    .waitFor();
  await switchLanguage("Language", "Español");
  await page
    .getByRole("heading", { name: "Mis listas", exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    roster,
  );
  await page.reload();
  await page
    .getByRole("heading", { name: "Mis listas", exact: true })
    .waitFor();

  for (const [route, heading] of [
    ["settings", "Ajustes de la aplicación"],
    ["collection", "Mi colección"],
    ["match-history", "Historial de partidas"],
    ["database", "Base de datos de perfiles"],
  ]) {
    await page.goto(`http://127.0.0.1:5197/${route}`);
    await page.getByRole("heading", { name: heading, exact: true }).waitFor();
  }
  await page.getByRole("table").waitFor();
  assert.ok((await page.getByRole("row").count()) > 1);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: ES/EN switching and persistence, unchanged roster storage, roster creation, main screens and database; no JavaScript errors.",
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
