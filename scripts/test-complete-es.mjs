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

const directory = mkdtempSync(join(tmpdir(), "mesbg-complete-"));
const logPath = join(directory, "vite.log");
const log = openSync(logPath, "w");
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "5199",
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
      const response = await fetch("http://127.0.0.1:5199", {
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

  await page.goto("http://127.0.0.1:5199/cards");
  await page.getByRole("heading", { name: "Biblioteca de cartas" }).waitFor();
  assert.match(await page.getByRole("status").innerText(), /535/);
  const search = page.getByRole("textbox", { name: "Buscar...", exact: true });
  // Mixed source books must still distinguish sides. Check actual rendered colors.
  await search.fill("Arnor & Angmar");
  const good = page
    .locator('main button[data-alignment="Good"]')
    .filter({ hasText: "Aranarth" });
  const evil = page
    .locator('main button[data-alignment="Evil"]')
    .filter({ hasText: "Angmar Orc Captain" });
  await good.waitFor();
  await evil.waitFor();
  assert.equal(
    await good.evaluate((el) => getComputedStyle(el).color),
    "rgb(25, 118, 210)",
  );
  assert.equal(
    await evil.evaluate((el) => getComputedStyle(el).color),
    "rgb(211, 47, 47)",
  );
  await page.setViewportSize({ width: 360, height: 800 });
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    true,
  );
  await page.screenshot({
    path: join(directory, "card-library-sides-mobile.png"),
  });
  await page.setViewportSize({ width: 1920, height: 1080 });
  await search.fill("Gandalf el Blanco");
  await page.locator("main li button").first().click();
  let dialog = page.getByRole("dialog").last();
  await dialog.locator("[data-configured-card]").waitFor();
  const spell = dialog.locator('button[data-rule-name="Transfix"]').first();
  await spell.click();
  let explanation = page.getByRole("dialog").last();
  assert.match(await explanation.innerText(), /Duración|objetivo|miniatura/);
  await page.keyboard.press("Escape");
  await spell.waitFor({ state: "visible" });
  assert.equal(
    await spell.evaluate((el) => el === document.activeElement),
    true,
  );
  await spell.focus();
  await page.keyboard.press("Enter");
  await page
    .getByRole("dialog")
    .last()
    .getByRole("button", { name: "Cerrar", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .locator('[data-test-id="dialog--close-button"]')
    .click();

  // Real library views for every faction plus long/paired/monster/crew profiles.
  for (const name of [
    "Smaug",
    "Shank & Wrot",
    "Bard's Family",
    "The Witch-king of Angmar",
    "Royal War Mumak",
    "Iron Hills Chariot",
    "Uruk-Hai Demolition Team",
    "Vault Warden Team",
  ]) {
    await search.fill(name);
    await page.locator("main li button").first().click();
    dialog = page.getByRole("dialog");
    await dialog.locator("[data-configured-card]").waitFor();
    assert.ok(
      (await dialog.locator("[data-configured-card]").innerText()).length > 150,
    );
    await dialog.locator("[data-configured-card]").screenshot({
      path: join(directory, name.replace(/[^a-z0-9]/gi, "-") + ".png"),
    });
    await dialog.locator('[data-test-id="dialog--close-button"]').click();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await search.fill("Boromir, Captain of the White Tower");
  await page.locator("main li button").first().click();
  dialog = page.getByRole("dialog");
  const customRule = dialog.locator('button[data-rule-name="Horn of Gondor"]');
  await customRule.click();
  explanation = page.getByRole("dialog").last();
  assert.match(await explanation.innerText(), /cuerno|combate|Combate/);
  await explanation
    .getByRole("button", { name: "Cerrar", exact: true })
    .click();
  assert.ok(
    await dialog
      .locator(".configured-profile-card")
      .evaluate((node) => parseFloat(getComputedStyle(node).fontSize) >= 14),
  );
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await dialog.screenshot({ path: join(directory, "mobile-boromir.png") });
  await dialog.locator('[data-test-id="dialog--close-button"]').click();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // Render the complete catalogue and every configured base selection to HTML.
  // Export one varied batch through the real PNG/ZIP exporter, not a mock.
  const downloadPromise = page.waitForEvent("download", { timeout: 180000 });
  const reportPromise = page.evaluate(async () => {
    const { mesbgData, profileData } = await import("/src/assets/data.ts");
    const { configuredCardForUnit, referenceCard } = await import(
      "/src/components/common/configured-cards/card-model.ts"
    );
    const { downloadConfiguredCards } = await import(
      "/src/components/common/configured-cards/export-cards.tsx"
    );
    const { useCalculator: calculator } = await import(
      "/src/hooks/calculations-and-displays/useCalculator.ts"
    );
    const { cardHtml } = await import("/scripts/card-render-fixture.ts");
    const original = JSON.stringify([mesbgData, profileData]);
    const batch = [];
    let htmlCount = 0;
    for (const [origin, profiles] of Object.entries(profileData)) {
      for (const name of Object.keys(profiles)) {
        const card = referenceCard(origin, name);
        const html = cardHtml(card);
        if (!html.includes("data-configured-card")) throw new Error(name);
        htmlCount++;
      }
      const name = Object.keys(profiles)[0];
      batch.push(referenceCard(origin, name));
    }
    let selections = 0;
    for (const raw of Object.values(mesbgData)) {
      const unit = calculator().recalculatePointsForUnit({
        ...structuredClone(raw),
        id: raw.model_id,
        quantity: 1,
        pointsPerUnit: 0,
        pointsTotal: 0,
        options: raw.options.map((option) => ({
          ...option,
          quantity: option.included ? 1 : 0,
        })),
      });
      const card = configuredCardForUnit(unit);
      cardHtml(card);
      selections++;
      if (
        [
          "Shank & Wrot",
          "Sharkey & Worm",
          "Bard's Family",
          "Treebeard",
          "Gandalf the White",
          "Royal War Mumak",
          "Iron Hills Chariot",
        ].includes(raw.name) &&
        !batch.some((item) => item.name === raw.name)
      )
        batch.push(card);
    }
    const started = performance.now();
    await downloadConfiguredCards(batch);
    return {
      htmlCount,
      selections,
      cards: batch.length,
      milliseconds: Math.round(performance.now() - started),
      unchanged: original === JSON.stringify([mesbgData, profileData]),
      temporaryNodes: document.querySelectorAll('[style*="-100000px"]').length,
    };
  });
  const [download, report] = await Promise.all([
    downloadPromise,
    reportPromise,
  ]);
  const archivePath = join(directory, download.suggestedFilename());
  await download.saveAs(archivePath);
  const buffer = readFileSync(archivePath);
  const zip = await JSZip.loadAsync(buffer);
  const entries = Object.values(zip.files).filter((file) =>
    file.name.endsWith(".png"),
  );
  assert.equal(entries.length, report.cards);
  for (const entry of entries) {
    const png = await entry.async("nodebuffer");
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 2560);
    assert.ok(png.readUInt32BE(20) >= 1800);
  }
  assert.equal(report.htmlCount, 535);
  assert.equal(report.selections, 1276);
  assert.equal(report.unchanged, true);
  assert.equal(report.temporaryNodes, 0);
  assert.deepEqual(errors, []);
  console.log("PASS:", JSON.stringify({ ...report, zipBytes: buffer.length }));
  console.log(`Artifacts: ${directory}`);
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
