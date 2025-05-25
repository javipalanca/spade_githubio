// @ts-check
import { defineConfig } from "astro/config";

// Determinar si estamos en modo producción o desarrollo
const isProduction = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  site: "https://spade-agents.github.io",
  // Usar base path solo en producción (GitHub Pages)
  base: isProduction ? "/spade_githubio/" : "/",
  output: "static",
  build: {
    assets: "_astro",
  },
});
