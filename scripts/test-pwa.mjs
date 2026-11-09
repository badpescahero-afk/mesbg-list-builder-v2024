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

const directory = mkdtempSync(join(tmpdir(), "mesbg-pwa-"));
const logPath = join(directory, "preview.log");
const log = openSync(logPath, "w");
const baseURL = "http://127.0.0.1:5200";
const server = spawn(process.execPath, ["scripts/serve-standalone.mjs"], {
  stdio: ["ignore", log, log],
  env: { ...process.env, PORT: "5200" },
});
closeSync(log);
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server)
      assert.equal(server.exitCode, null, `Preview exited: ${logPath}`);
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
  assert.ok(ready, `Preview startup timeout: ${logPath}`);
  browser = await chromium.launchPersistentContext(
    join(directory, "browser-profile"),
    {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    },
  );
  const context = browser;
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/install`);
  await page
    .getByText("Lista para usar sin conexión:", { exact: false })
    .waitFor();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const cdp = await context.newCDPSession(page);
  const manifest = await cdp.send("Page.getAppManifest");
  assert.equal(JSON.parse(manifest.data).display, "standalone");
  assert.equal(JSON.parse(manifest.data).short_name, "MESBG ES");
  assert.deepEqual(
    (await cdp.send("Page.getInstallabilityErrors")).installabilityErrors,
    [],
  );
  await page.screenshot({
    path: join(directory, "install-mobile.png"),
    fullPage: true,
  });
  // Browser prompt UX: accepted alone must not falsely report installation.
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    event.prompt = async () => {
      window.__promptCalls = (window.__promptCalls || 0) + 1;
    };
    event.userChoice = Promise.resolve({ outcome: "accepted" });
    window.dispatchEvent(event);
  });
  await page
    .getByRole("button", { name: "Instalar en este dispositivo", exact: true })
    .click();
  assert.equal(await page.evaluate(() => window.__promptCalls), 1);
  assert.equal(
    await page.getByText("La app está instalada.", { exact: true }).count(),
    0,
  );
  await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
  await page.getByText("La app está instalada.", { exact: true }).waitFor();
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
  let pictureSaved = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    pictureSaved = await page.evaluate(async () => {
      const cache = await caches.open("mesbg-es-images-v1");
      return (await cache.keys()).some((key) => key.url.includes("Boromir"));
    });
    if (pictureSaved) break;
    await setTimeout(100);
  }
  assert.ok(
    pictureSaved,
    "Portrait must be fully saved before testing offline access",
  );
  await dialog.locator('[data-test-id="dialog--close-button"]').click();
  const rosterURL = page.url();
  await context.setOffline(true);
  await page.reload();
  await page.locator('[data-test-id="open-profile-card--w1-i0"]').click();
  dialog = page.getByRole("dialog");
  await dialog.locator("[data-configured-card]").waitFor();
  await dialog
    .locator(".configured-card-portrait")
    .evaluate((img) => img.decode());
  assert.equal(
    await dialog
      .locator(".configured-card-portrait")
      .evaluate((img) => img.naturalWidth),
    200,
  );
  await dialog.locator('button[data-rule-name="Horn of Gondor"]').click();
  await page
    .getByRole("dialog")
    .last()
    .getByText("Este es un cuerno de guerra único.", { exact: false })
    .waitFor();
  await page
    .getByRole("dialog")
    .last()
    .getByRole("button", { name: "Cerrar", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download", { timeout: 90000 });
  await dialog.getByRole("button", { name: "Descargar", exact: true }).click();
  const download = await downloadPromise;
  const archivePath = join(directory, download.suggestedFilename());
  await download.saveAs(archivePath);
  const zip = await JSZip.loadAsync(readFileSync(archivePath));
  const entries = Object.values(zip.files).filter((file) =>
    file.name.endsWith(".png"),
  );
  assert.equal(entries.length, 1);
  const png = await entries[0].async("nodebuffer");
  assert.equal(png.readUInt32BE(16), 2560);
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  await dialog.locator('[data-test-id="dialog--close-button"]').click();
  await page.goto(`${baseURL}/cards`);
  await page
    .getByRole("heading", { name: "Biblioteca de cartas", exact: true })
    .waitFor();
  assert.match(await page.getByRole("status").innerText(), /535/);
  await page.goto(`${baseURL}/roster/${saved.id}/pdf-printable`);
  await page.locator("#pdf-profiles").waitFor();
  const pdf = await page.pdf({
    path: join(directory, "offline-roster.pdf"),
    format: "A4",
  });
  assert.ok(pdf.length > 1000);
  await page.goto(rosterURL);
  await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  const cacheState = await page.evaluate(async () => {
    const names = await caches.keys();
    const shell = await caches.open(
      names.find((name) => name.startsWith("mesbg-es-shell-")),
    );
    const images = await caches.open("mesbg-es-images-v1");
    let imageBytes = 0;
    for (const key of await images.keys())
      imageBytes += Number(
        (await images.match(key)).headers.get("x-mesbg-image-bytes"),
      );
    return {
      shell: (await shell.keys()).length,
      images: (await images.keys()).length,
      imageBytes,
    };
  });
  assert.ok(cacheState.shell >= 25);
  assert.ok(cacheState.imageBytes <= 32 * 1024 * 1024);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: installability, icon/manifest, prompt UX, mobile list creation, offline reload, rules, card ZIP and PDF; roster unchanged; bounded image cache.",
    cacheState,
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
      ? `Preview stopped. Log: ${logPath}`
      : `External preview checked: ${baseURL}`,
  );
}
