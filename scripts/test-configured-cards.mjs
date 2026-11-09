/* eslint-env node, es2021 */
// Run with: node scripts/test-configured-cards.mjs
// A bounded browser test: Vite runs in a child process with a log and is stopped
// in finally. No existing server or browser storage is reused.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { openSync, closeSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout } from "node:timers/promises";
import JSZip from "jszip";
import { chromium } from "playwright";

const directory = mkdtempSync(join(tmpdir(), "mesbg-cards-"));
const logPath = join(directory, "vite.log");
const log = openSync(logPath, "w");
const externalURL = process.env.MESBG_TEST_URL;
const baseURL = externalURL || "http://127.0.0.1:5198";
const server = externalURL
  ? null
  : spawn(
      process.execPath,
      [
        "node_modules/vite/bin/vite.js",
        "--host",
        "127.0.0.1",
        "--port",
        "5198",
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
    if (server) assert.equal(server.exitCode, null, `Vite exited: ${logPath}`);
    try {
      const response = await fetch(baseURL, {
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
  await page.goto(`${baseURL}/rosters`);
  await page.getByText("Todavía no hay listas.", { exact: true }).waitFor();
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
    .fill("Prueba de cartas configuradas");
  await page.getByRole("combobox", { name: "Ejército", exact: true }).click();
  await page
    .getByRole("option")
    .filter({ has: page.getByText("Minas Tirith", { exact: true }) })
    .click();
  await page.locator('[data-test-id="dialog--submit-button"]').click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.locator('[data-test-id="select-unit--w1-i0"]').click();
  let drawer = page.locator(".MuiDrawer-root.MuiModal-root .MuiDrawer-paper");
  await drawer.locator("#hero-selection-list--name-filter").fill("Boromir");
  await drawer
    .locator(".MuiPaper-elevation3")
    .filter({ hasText: "Boromir, Captain of the White Tower" })
    .first()
    .click();
  await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  await page
    .locator('[data-test-id="option-list--w1-i0"] input[name="Horse"]')
    .check();
  await page
    .locator('[data-test-id="option-list--w1-i0"] input[name="Shield"]')
    .check();
  for (const [index, option] of [
    [1, "Shield"],
    [2, "Shield and spear"],
  ]) {
    await page.locator('[data-test-id="warband-1--add-unit"]').click();
    drawer = page.locator(".MuiDrawer-root.MuiModal-root .MuiDrawer-paper");
    await drawer
      .locator("#hero-selection-list--name-filter")
      .fill("Warrior of Minas Tirith");
    await drawer
      .locator(".MuiPaper-elevation3")
      .filter({ hasText: "Warrior of Minas Tirith" })
      .first()
      .click();
    await page
      .locator(
        `[data-test-id="option-list--w1-i${index}"] input[name="${option}"]`,
      )
      .check();
  }
  const before = await page.evaluate(() => localStorage.getItem("mlb-rosters"));
  const saved = JSON.parse(before).state.rosters[0];
  assert.equal(saved.warbands[0].hero.pointsPerUnit, 185);
  await page.locator('[data-test-id="open-profile-card--w1-i0"]').click();
  let dialog = page.getByRole("dialog");
  await dialog.locator("[data-configured-card]").waitFor();
  assert.equal(
    (await dialog.locator("[data-card-points]").innerText()).trim(),
    "185 pts",
  );
  assert.equal(
    (await dialog.locator('[data-stat="D"]').first().innerText()).trim(),
    "7",
  );
  await dialog.getByRole("heading", { name: "Caballo", exact: true }).waitFor();
  await dialog
    .locator(".configured-card-portrait")
    .evaluate((img) => img.decode());
  assert.ok(
    (
      await dialog.locator(".configured-card-portrait").getAttribute("src")
    ).includes("/Gondor/pictures/"),
  );
  assert.equal(
    await dialog
      .locator(".configured-card-portrait")
      .evaluate((img) => img.naturalWidth),
    200,
  );
  await dialog
    .getByRole("button", { name: "Ver carta original", exact: true })
    .click();
  await dialog.locator('img.profile_card[src*="/cards/"]').first().waitFor();
  await dialog
    .getByRole("button", {
      name: "Ver carta con el equipo elegido",
      exact: true,
    })
    .click();
  await dialog
    .locator("[data-configured-card]")
    .screenshot({ path: join(directory, "boromir-preview.png") });
  await dialog.locator('[data-test-id="dialog--close-button"]').click();
  await page
    .getByRole("button", { name: "share-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Descargar cartas de perfil", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog.locator("[data-configured-card]").nth(2).waitFor();
  assert.equal(await dialog.locator("[data-configured-card]").count(), 3);
  assert.deepEqual(
    await dialog.locator("[data-card-points]").allTextContents(),
    ["185 pts", "9 pts", "10 pts"],
  );
  const downloadPromise = page.waitForEvent("download", { timeout: 90000 });
  await dialog.locator('[data-test-id="dialog--submit-button"]').click();
  const download = await downloadPromise;
  const archivePath = join(directory, download.suggestedFilename());
  await download.saveAs(archivePath);
  const zip = await JSZip.loadAsync(readFileSync(archivePath));
  const entries = Object.values(zip.files).filter((file) =>
    file.name.endsWith(".png"),
  );
  assert.equal(entries.length, 3);
  assert.equal(new Set(entries.map((file) => file.name)).size, 3);
  for (const entry of entries) {
    const png = await entry.async("nodebuffer");
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 2560);
    assert.ok(png.readUInt32BE(20) >= 1800);
  }
  await dialog.waitFor({ state: "hidden" });
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  await page
    .getByRole("button", { name: "share-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Descargar cartas de perfil", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  await dialog
    .getByRole("button", { name: "Cartas originales", exact: true })
    .click();
  const originalDownloadPromise = page.waitForEvent("download", {
    timeout: 90000,
  });
  await dialog.locator('[data-test-id="dialog--submit-button"]').click();
  const originalDownload = await originalDownloadPromise;
  const originalPath = join(directory, originalDownload.suggestedFilename());
  await originalDownload.saveAs(originalPath);
  const originalZip = await JSZip.loadAsync(readFileSync(originalPath));
  const jpgs = Object.values(originalZip.files).filter((file) =>
    file.name.endsWith(".jpg"),
  );
  assert.ok(jpgs.length >= 2);
  for (const entry of jpgs) {
    const jpg = await entry.async("nodebuffer");
    assert.equal(jpg.readUInt16BE(0), 0xffd8);
  }
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page
    .getByRole("button", { name: "share-buttons", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Descargar cartas de perfil", exact: true })
    .click();
  dialog = page.getByRole("dialog");
  let unexpectedDownload = false;
  const onCancelledDownload = () => {
    unexpectedDownload = true;
  };
  page.on("download", onCancelledDownload);
  await dialog.locator('[data-test-id="dialog--submit-button"]').click();
  await dialog.getByRole("status").waitFor();
  await dialog.locator('[data-test-id="dialog--cancel-button"]').click();
  await page.waitForFunction(
    () => !document.querySelector('[style*="-100000px"]'),
  );
  assert.equal(unexpectedDownload, false);
  page.off("download", onCancelledDownload);
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: configured hero and two warrior loadouts; correct costs/stats/mount; original cards accessible; ZIP has 3 distinct high-resolution PNGs; original ZIP contains valid JPGs; cancellation cleans up without a partial download; roster unchanged.",
  );
  console.log(`Artifacts: ${directory}`);
} finally {
  await browser?.close();
  if (server?.exitCode === null) {
    const stopped = once(server, "exit");
    server.kill("SIGTERM");
    const killTimer = globalThis.setTimeout(() => server.kill("SIGKILL"), 5000);
    await stopped;
    clearTimeout(killTimer);
  }
  console.log(
    server
      ? `Vite stopped. Log: ${logPath}`
      : `External preview checked: ${baseURL}`,
  );
}
