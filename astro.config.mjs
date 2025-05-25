// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://spade-agents.github.io",
  // No base path needed as this is now at the root of the repository
  output: "static",
  build: {
    assets: "_astro",
  },
});
