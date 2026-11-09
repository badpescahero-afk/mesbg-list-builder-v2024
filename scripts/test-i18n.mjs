/* eslint-env node, es2021 */
// Run with: node scripts/test-i18n.mjs
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
    viewport: { width: 1920, height: 1080 },
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
  // Select a real hero so export/import checks exercise non-empty game data.
  const heroPlaceholder = page.locator('[data-test-id="select-unit--w1-i0"]');
  if (await heroPlaceholder.count()) {
    await heroPlaceholder.click();
    await page
      .locator(
        ".MuiDrawer-root.MuiModal-root .MuiDrawer-paper .MuiPaper-elevation3",
      )
      .first()
      .click();
    await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  }
  // User names matching translation keys must remain literal.
  await page.goto("http://127.0.0.1:5197/rosters");
  await page
    .getByRole("button", { name: "action-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Crear grupo", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Nombre del grupo", exact: true })
    .fill("Good");
  await page.locator('[data-test-id="dialog--submit-button"]').click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByText("Good", { exact: true }).first().waitFor();
  const roster = await page.evaluate(() => localStorage.getItem("mlb-rosters"));
  assert.ok(JSON.parse(roster).state.rosters.length > 0);

  console.log("PASS: Spanish roster creation and storage");
  const switchLanguage = async (label, option) => {
    await page
      .getByRole("combobox", { name: new RegExp(`^${label}(?:\\s|$)`) })
      .click();
    await page.getByRole("option", { name: option, exact: true }).click();
  };
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

  await page.getByText("Good", { exact: true }).first().waitFor();

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
  // Spanish UI deliberately keeps the original stat headers and values.
  for (const header of ["Mv / Range", "Fv", "Sv", "S", "D", "A", "C", "I"]) {
    await page
      .getByRole("columnheader", { name: header, exact: true })
      .waitFor();
  }
  const statsBefore = (
    await page.getByRole("row").nth(1).locator("td").allTextContents()
  ).slice(4);
  await switchLanguage("Idioma", "English");
  await page
    .getByRole("heading", { name: "Profile Database", exact: true })
    .waitFor();
  assert.deepEqual(
    (await page.getByRole("row").nth(1).locator("td").allTextContents()).slice(
      4,
    ),
    statsBefore,
  );
  await switchLanguage("Language", "Español");
  await page
    .getByRole("heading", { name: "Base de datos de perfiles", exact: true })
    .waitFor();
  console.log(
    "PASS: original stat headers and values remain unchanged in both languages",
  );

  // Common rules are translated in the drawer and searchable in both languages.
  const originalRules = JSON.parse(
    readFileSync("src/assets/data/keywords.json", "utf8"),
  );
  const spanishRules = JSON.parse(
    readFileSync("src/i18n/content/keywords.es.json", "utf8"),
  );
  const march = originalRules.find((rule) => rule.name === "Heroic March");
  await page.getByText("Reglas especiales y magia", { exact: true }).click();
  let ruleDrawer = page.locator(
    ".MuiDrawer-root.MuiModal-root .MuiDrawer-paper",
  );
  await ruleDrawer.getByPlaceholder("Buscar...").fill("Marcha heroica");
  await ruleDrawer.getByText("Marcha heroica", { exact: true }).waitFor();
  const spanishMarchButton = ruleDrawer.getByRole("button", {
    name: /^Marcha heroica/,
  });
  if ((await spanishMarchButton.getAttribute("aria-expanded")) === "false")
    await spanishMarchButton.click();
  await ruleDrawer
    .locator(".MuiAccordionDetails-root")
    .getByText(spanishRules[march.description].split("\n")[0], { exact: false })
    .waitFor();
  await ruleDrawer.getByPlaceholder("Buscar...").fill("Heroic March");
  await ruleDrawer.getByText("Marcha heroica", { exact: true }).waitFor();
  await ruleDrawer.locator('button:has([data-testid="CloseIcon"])').click();
  await switchLanguage("Idioma", "English");
  await page.getByText("Special rules & Magic", { exact: true }).click();
  ruleDrawer = page.locator(".MuiDrawer-root.MuiModal-root .MuiDrawer-paper");
  await ruleDrawer.getByPlaceholder("Search...").fill("Marcha heroica");
  await ruleDrawer.getByText("Heroic March", { exact: true }).waitFor();
  const englishMarchButton = ruleDrawer.getByRole("button", {
    name: /^Heroic March/,
  });
  if ((await englishMarchButton.getAttribute("aria-expanded")) === "false")
    await englishMarchButton.click();
  await ruleDrawer
    .locator(".MuiAccordionDetails-root")
    .getByText(march.description.split("\n")[0], { exact: false })
    .waitFor();
  await ruleDrawer.locator('button:has([data-testid="CloseIcon"])').click();
  await switchLanguage("Language", "Español");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    roster,
  );
  console.log(
    "PASS: Spanish/English rule descriptions and bilingual search preserve roster data",
  );

  // Export JSON uses original keys, model IDs and army names in Spanish UI.
  const savedRoster = JSON.parse(roster).state.rosters[0];
  assert.ok(
    savedRoster.metadata.units > 0,
    "Round-trip must include selected models",
  );
  assert.ok(
    savedRoster.metadata.points > 0,
    "Round-trip must include non-zero points",
  );
  const armyRules = JSON.parse(
    readFileSync("src/assets/data/army_list_data.json", "utf8"),
  )[savedRoster.armyList];
  const armySpanish = JSON.parse(
    readFileSync("src/i18n/content/armies.es.json", "utf8"),
  );
  const namesSpanish = JSON.parse(
    readFileSync("src/i18n/content/names.es.json", "utf8"),
  );
  await page.goto(
    `http://127.0.0.1:5197/roster/${savedRoster.id}/pdf-printable`,
  );
  await page.locator("#pdf-army").waitFor();
  if (armyRules.special_rules.length) {
    await page
      .locator("#pdf-rules")
      .getByText(armySpanish[armyRules.special_rules[0].title], { exact: true })
      .waitFor();
  }
  await page
    .locator("#pdf-profiles")
    .getByText(namesSpanish[savedRoster.warbands[0].hero.name], { exact: true })
    .first()
    .waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    roster,
  );
  console.log(
    "PASS: translated PDF army rules and profile names preserve the canonical populated roster",
  );

  await page.goto("http://127.0.0.1:5197/rosters");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__exportedRoster = text;
        },
      },
    });
  });
  await page
    .locator(`[data-test-id="rosters--${savedRoster.id}--link"]`)
    .getByRole("button")
    .click();
  await page
    .getByRole("menuitem", { name: "Exportar lista", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Copiar al portapapeles", exact: true })
    .click();
  const exported = JSON.parse(
    await page.evaluate(() => window.__exportedRoster),
  );
  assert.equal(exported.armyList, savedRoster.armyList);
  assert.equal(exported.name, savedRoster.name);
  assert.equal(exported.id, savedRoster.id);
  assert.equal(exported.edition, "v2024");
  assert.deepEqual(
    exported.warbands.map((w) => w.hero?.model_id),
    savedRoster.warbands.map((w) => w.hero?.model_id),
  );
  console.log(
    "PASS: export keeps original JSON keys, army names and model IDs",
  );

  // A destructive dialog is translated, and cancel leaves the data intact.
  await page
    .locator(`[data-test-id="rosters--${savedRoster.id}--link"]`)
    .getByRole("button")
    .click();
  await page
    .getByRole("menuitem", { name: "Eliminar lista", exact: true })
    .click();
  await page
    .getByText("Esta acción es irreversible.", { exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    roster,
  );

  // Import the real exported payload and verify game numbers and IDs survive.
  await page
    .getByRole("button", { name: "action-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Crear lista", exact: true })
    .click();
  await page.getByRole("tab", { name: "Importar lista", exact: true }).click();
  await page
    .getByRole("textbox", {
      name: "Importación de listas en JSON",
      exact: true,
    })
    .fill(JSON.stringify({ ...exported, name: "Lista importada" }));
  await page.locator('[data-test-id="dialog--submit-button"]').click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.getByText("Lista importada", { exact: true }).first().waitFor();
  const imported = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("mlb-rosters")).state.rosters.find(
      (item) => item.name === "Lista importada",
    ),
  );
  assert.equal(imported.armyList, savedRoster.armyList);
  assert.equal(imported.metadata.points, savedRoster.metadata.points);
  assert.equal(imported.metadata.units, savedRoster.metadata.units);
  assert.deepEqual(
    imported.warbands.map((w) => w.hero?.model_id),
    savedRoster.warbands.map((w) => w.hero?.model_id),
  );
  console.log(
    "PASS: JSON export/import round-trip preserves points, unit counts and model IDs",
  );

  // Record a match through the translated form. Result data must stay Won,
  // even though both the form and the history display Victoria.
  await page.goto("http://127.0.0.1:5197/match-history");
  await page
    .getByRole("button", { name: "action-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Registrar una partida", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await dialog.locator('input[name="points"]').fill("500");
  await dialog.locator('input[name="bows"]').fill("0");
  await dialog.locator('input[name="throwingWeapons"]').fill("0");
  await dialog.locator('input[name="victoryPoints"]').fill("3");
  await dialog.locator('input[name="opponentVictoryPoints"]').fill("1");
  await dialog.locator('input[name="opponentName"]').fill("Rival de prueba");
  await dialog.getByRole("combobox", { name: /^Ejércitos(?: \*|$)/ }).click();
  await page.getByRole("option").first().click();
  await dialog.locator('[data-test-id="dialog--submit-button"]').click();
  await dialog.waitFor({ state: "hidden" });
  await page.getByText("Victoria", { exact: true }).first().waitFor();
  const matches = await page.evaluate(() =>
    localStorage.getItem("mlb-matches"),
  );
  assert.equal(JSON.parse(matches).state.recentGames[0].result, "Won");
  await switchLanguage("Idioma", "English");
  await page.getByText("Won", { exact: true }).first().waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-matches")),
    matches,
  );
  await switchLanguage("Language", "Español");
  await page.getByText("Victoria", { exact: true }).first().waitFor();
  console.log(
    "PASS: match recording, translated result display, and unchanged Won result in storage",
  );

  // Validation messages are translated without requiring a Firebase account.
  await page.goto("http://127.0.0.1:5197/sign-in");
  await page
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();
  await page
    .getByText("Debes introducir una contraseña para iniciar sesión.", {
      exact: true,
    })
    .waitFor();
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
