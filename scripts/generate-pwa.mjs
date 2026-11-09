/* eslint-env node, es2021 */
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const paths = ["/index.html", "/manifest.json", "/favicon.ico"];
function collect(directory) {
  for (const entry of readdirSync(join("build", directory), {
    withFileTypes: true,
  })) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) collect(path);
    else paths.push(path);
  }
}
collect("/assets");
collect("/icons");
const hash = createHash("sha256");
for (const path of paths)
  hash.update(path).update(readFileSync(join("build", path)));
const source = readFileSync("scripts/service-worker.js", "utf8")
  .replace("__BUILD_ID__", hash.digest("hex").slice(0, 16))
  .replace(
    "const PRECACHE = __PRECACHE__;",
    `const PRECACHE = ${JSON.stringify(paths)};`,
  );
writeFileSync("build/sw.js", source);
console.log(
  `PWA ready: ${paths.length} app files precached; profile images cached on demand.`,
);
