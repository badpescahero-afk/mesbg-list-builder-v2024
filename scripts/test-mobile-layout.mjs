/* eslint-env node, es2021 */
// Run with: node scripts/test-mobile-layout.mjs
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

const directory = mkdtempSync(join(tmpdir(), "mesbg-mobile-"));
const logPath = join(directory, "vite.log");
const log = openSync(logPath, "w");
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "5201",
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
      const response = await fetch("http://127.0.0.1:5201", {
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
    viewport: { width: 390, height: 844 },
  });
  await page.goto("http://127.0.0.1:5201/rosters");
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
    .fill("Prueba móvil Gandalf");
  await page.getByRole("combobox", { name: "Ejército", exact: true }).click();
  await page
    .getByRole("option")
    .filter({ has: page.getByText("Atop the Walls", { exact: true }) })
    .click();
  await page.locator('[data-test-id="dialog--submit-button"]').click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
  await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  await setTimeout(700); // Let the route transition finish before measuring.
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  async function assertFits(label) {
    await setTimeout(400); // Drawer and responsive layout transitions.
    const overflowing = await page.evaluate(() =>
      [...document.querySelectorAll("main *, header, header *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return (
            r.width > 0 &&
            r.height > 0 &&
            (r.right > innerWidth + 1 || r.left < -1)
          );
        })
        .slice(0, 12)
        .map((el) => ({
          tag: el.tagName,
          text: el.textContent.slice(0, 70),
          right: el.getBoundingClientRect().right,
        })),
    );
    assert.deepEqual(
      overflowing,
      [],
      `${label}: content must fit without clipping`,
    );
  }
  await assertFits("Gandalf at 390px");
  await page.screenshot({
    path: join(directory, "gandalf-mobile.png"),
    fullPage: true,
  });
  await page.locator('[data-test-id="warband-1--add-unit"]').click();
  const drawer = page.locator(".MuiDrawer-root.MuiModal-root .MuiDrawer-paper");
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
      '[data-test-id="option-list--w1-i1"] input[name="Shield and spear"]',
    )
    .check();
  const before = await page.evaluate(() => localStorage.getItem("mlb-rosters"));
  const saved = JSON.parse(before).state.rosters[0];
  assert.equal(saved.warbands[0].hero.pointsPerUnit, 200);
  assert.equal(saved.warbands[0].units[0].pointsPerUnit, 10);
  const rosterURL = page.url();
  for (const width of [
    320, 360, 390, 412, 568, 600, 768, 899, 900, 1280, 1920,
  ]) {
    await page.setViewportSize({ width, height: width === 568 ? 320 : 844 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await assertFits(`Roster at ${width}px`);
    if (width < 1536) {
      const header = await page.locator("header").boundingBox();
      const toolbar = await page
        .locator("main .MuiToolbar-root")
        .first()
        .boundingBox();
      assert.ok(
        toolbar.y >= header.y + header.height - 1,
        "Points bar must remain below the app header",
      );
    }
    const clipped = await page
      .locator('[data-test-id="warband-1--add-unit"]')
      .evaluate((el) => {
        for (
          let node = el;
          node && node.tagName !== "MAIN";
          node = node.parentElement
        )
          if (node.scrollWidth > node.clientWidth + 1)
            return node.outerHTML.slice(0, 200);
        return null;
      });
    assert.equal(
      clipped,
      null,
      `Warband must not need horizontal scrolling at ${width}px`,
    );
    assert.equal(
      await page.evaluate(() => localStorage.getItem("mlb-rosters")),
      before,
    );
    if (width === 390 || width === 1920)
      await page.screenshot({
        path: join(directory, `roster-${width}.png`),
        fullPage: true,
      });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator("header")
    .getByRole("button", { name: "Abrir menú lateral", exact: true })
    .click();
  const menu = page.locator("#navigation-drawer .MuiDrawer-paper");
  await menu.getByRole("button", { name: "Cerrar", exact: true }).waitFor();
  assert.ok((await menu.boundingBox()).width <= 390);
  await menu.getByRole("button", { name: "Cerrar", exact: true }).click();
  await page.locator("#navigation-drawer").waitFor({ state: "hidden" });
  await assertFits("Menu closed");
  await page
    .locator("header")
    .getByRole("button", { name: "Abrir menú lateral", exact: true })
    .click();
  await menu.locator('[data-test-id="my-rosters--nav-link"]').click();
  await page.waitForURL("**/rosters");
  await page.locator("#navigation-drawer").waitFor({ state: "hidden" });
  await page.goto(rosterURL);
  await page.locator('[data-test-id="unit-card--w1-i0"]').waitFor();
  await setTimeout(700);
  await page
    .locator('[data-test-id="warband-header--1--collapse-self-action"]')
    .click();
  await assertFits("Collapsed company");
  await page
    .locator('[data-test-id="warband-header--1--collapse-self-action"]')
    .click();
  await assertFits("Expanded company");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  assert.deepEqual(errors, []);
  console.log(
    `PASS: mobile/desktop roster fits, menu opens/closes, equipment and roster unchanged. Artifacts: ${directory}`,
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
