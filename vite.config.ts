import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const currentDate = new Date()
  .toLocaleDateString("en-UK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  .replace(/ /g, "-");

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: "/",
  plugins: [react()],
  // Keep a single React instance when the browser test renders the catalogue.
  optimizeDeps: { include: ["react-dom/server"] },
  define: {
    BUILD_VERSION: JSON.stringify(process.env.npm_package_version),
    BUILD_DATE: JSON.stringify(currentDate),
    BUILD_COMMIT: JSON.stringify(process.env.COMMIT_REF || ""),
    RESOURCES_URL: JSON.stringify(
      process.env.VITE_RESOURCES_URL ||
        (command === "serve"
          ? "/static-resources"
          : "https://resources.mesbg-list-builder.com/v2024"),
    ),
    API_URL: JSON.stringify("https://api.mesbg-list-builder.com/v2024"),
  },
  build: {
    outDir: "./build",
    emptyOutDir: true,
  },
}));
