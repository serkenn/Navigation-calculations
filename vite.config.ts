import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { execSync } from "child_process";
import { readFileSync } from "fs";

const currentTag = (() => {
  try {
    return execSync("git describe --tags --abbrev=0", {
      encoding: "utf-8",
    }).trim();
  } catch {
    // Fall back to package.json version if no git tags exist
    try {
      const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
      return `v${pkg.version}`;
    } catch {
      return "v0.0.0";
    }
  }
})();

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: "dist",
        assets: "dist",
        fallback: "index.html",
        precompress: false,
      }),
      paths: { relative: false },
      prerender: { entries: ["*"] },
    }),
  ],
  define: { __APP_VERSION__: JSON.stringify(currentTag) },
});
