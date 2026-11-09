/* eslint-env node, es2021 */
import { spawnSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";

if (!existsSync("static-resources/images/profiles"))
  throw new Error("Missing original profile resources");
const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  env: { ...process.env, VITE_RESOURCES_URL: "/static-resources" },
});
if (result.status !== 0) process.exit(result.status || 1);
cpSync("static-resources", "build/static-resources", { recursive: true });
console.log("Self-contained build ready. Run npm run preview:standalone.");
