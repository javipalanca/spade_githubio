// @ts-check
import { defineConfig } from "astro/config";

// Determinar si estamos en modo producción o desarrollo
const isProduction = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  site: "https://spadeagents.eu",
  // Usar base path solo en producción (GitHub Pages)
  base: isProduction ? "/" : "/",
  output: "static",
  build: {
    assets: "_astro",
  },
});
