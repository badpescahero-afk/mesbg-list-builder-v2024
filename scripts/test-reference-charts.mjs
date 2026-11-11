/* eslint-env node, es2021 */
// Run with: node scripts/test-reference-charts.mjs
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

const directory = mkdtempSync(join(tmpdir(), "mesbg-charts-"));
const logPath = join(directory, "vite.log");
const log = openSync(logPath, "w");
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "--host",
    "127.0.0.1",
    "--port",
    "5204",
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
      const response = await fetch("http://127.0.0.1:5204", {
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
    viewport: { width: 1280, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("http://127.0.0.1:5204/rosters");
  await page.getByText("Tablas", { exact: true }).click();
  await page.getByText("Tabla de escalada", { exact: true }).click();
  await page.locator('[data-reference-chart="climb-table"]').waitFor();
  await page
    .getByRole("dialog")
    .locator('[data-test-id="dialog--close-button"]')
    .click();
  const titles = await page.evaluate(
    async () => (await import("/src/constants/charts.ts")).charts,
  );
  const spanish = JSON.parse(
    readFileSync("src/i18n/content/charts.es.json", "utf8"),
  );
  const before = await page.evaluate(() => localStorage.getItem("mlb-rosters"));
  const openChart = async (id) => {
    await page.evaluate(
      async ({ id, title }) => {
        const { useAppState } = await import("/src/state/app/index.ts");
        useAppState
          .getState()
          .setCurrentModal("CHART", { selectedChart: id, title });
      },
      { id, title: titles[id] },
    );
  };
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const id of Object.keys(spanish)) {
      await openChart(id);
      const table = page.locator(`[data-reference-chart="${id}"]`);
      await table.waitFor();
      assert.deepEqual(
        await table.locator("thead th").allTextContents(),
        spanish[id].columns,
      );
      assert.equal(
        await table.locator("tbody tr").count(),
        spanish[id].rows.length,
      );
      assert.equal(
        await table.evaluate(
          (el) =>
            el.scrollWidth <= el.clientWidth &&
            el.getBoundingClientRect().right <= innerWidth,
        ),
        true,
        `${id} overflows at ${width}px`,
      );
      assert.equal(
        await page
          .getByRole("dialog")
          .evaluate((el) => el.scrollWidth <= el.clientWidth),
        true,
      );
      assert.equal(
        await table
          .locator("tbody tr")
          .nth(1)
          .evaluate((el) => getComputedStyle(el).backgroundColor),
        "rgba(231, 217, 205, 0.73)",
      );
      await page.screenshot({
        path: join(directory, `${id}-${width}.png`),
        animations: "disabled",
        fullPage: true,
      });
      // Even on small screens the last rule must be reachable by scrolling.
      await table.locator("tbody tr").last().scrollIntoViewIfNeeded();
      assert.equal(await table.locator("tbody tr").last().isVisible(), true);
      await page
        .getByRole("dialog")
        .locator('[data-test-id="dialog--close-button"]')
        .click();
    }
    await openChart("to-wound-chart");
    await page
      .getByRole("table", { name: "Tabla para herir", exact: true })
      .waitFor();
    await page
      .getByRole("dialog")
      .getByText("FUERZA", { exact: true })
      .waitFor();
    await page
      .getByRole("dialog")
      .getByText("DEFENSA", { exact: true })
      .waitFor();
    const matrix = page.getByRole("table");
    assert.equal(await matrix.locator("tbody td").count(), 100);
    assert.equal(
      await page
        .getByRole("dialog")
        .evaluate((el) => el.scrollWidth <= el.clientWidth),
      true,
    );
    await page
      .getByRole("dialog")
      .locator('[data-test-id="dialog--close-button"]')
      .click();
  }
  const spanishMatrix = await (async () => {
    await openChart("to-wound-chart");
    const values = await page
      .getByRole("table")
      .locator("tbody td")
      .allTextContents();
    await page
      .getByRole("dialog")
      .locator('[data-test-id="dialog--close-button"]')
      .click();
    return values;
  })();
  await page.locator("#interface-language").click();
  await page.getByRole("option", { name: "English", exact: true }).click();
  for (const id of Object.keys(spanish)) {
    await openChart(id);
    const img = page
      .getByRole("dialog")
      .getByRole("img", { name: id, exact: true });
    await img.waitFor();
    assert.match(
      await img.getAttribute("src"),
      new RegExp(`/images/charts/${id}\\.png$`),
    );
    assert.equal(await page.locator("[data-reference-chart]").count(), 0);
    await page
      .getByRole("dialog")
      .locator('[data-test-id="dialog--close-button"]')
      .click();
  }
  await openChart("to-wound-chart");
  await page
    .getByRole("table", { name: "To Wound Chart", exact: true })
    .waitFor();
  assert.deepEqual(
    await page.getByRole("table").locator("tbody td").allTextContents(),
    spanishMatrix,
  );
  await page
    .getByRole("dialog")
    .getByText("STRENGTH", { exact: true })
    .waitFor();
  await page
    .getByRole("dialog")
    .getByText("DEFENCE", { exact: true })
    .waitFor();
  assert.equal(
    await page.evaluate(() => localStorage.getItem("mlb-rosters")),
    before,
  );
  assert.deepEqual(errors, []);
  console.log(
    `PASS: all 11 charts translated; original English images and wound values preserved; 320/390/1280px layouts; unchanged storage. Artifacts: ${directory}`,
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
