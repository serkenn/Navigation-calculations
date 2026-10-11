import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { execSync } from "child_process";
import { readFileSync } from "fs";

const run = (cmd: string) =>
  execSync(cmd, {
    encoding: "utf-8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

/** "v2.6.0" 形式のタグのうち最も新しいもの */
function latestVersionTag(tags: string[]) {
  const parse = (t: string) => t.slice(1).split(".").map(Number);
  return tags
    .filter((t) => /^v\d+\.\d+\.\d+$/.test(t))
    .sort((a, b) => {
      const [x, y] = [parse(a), parse(b)];
      return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    })
    .at(-1);
}

/**
 * アプリのバージョン表示（__APP_VERSION__）
 * 1. 手元の履歴から直近のタグ（通常の clone）
 * 2. リモートのタグ一覧から最新のタグ（Cloudflare Pages など浅い clone でタグがない場合）
 * 3. package.json の version
 */
const currentTag = (() => {
  try {
    return run("git describe --tags --abbrev=0");
  } catch {
    // 浅い clone では describe できないので、リモートのタグを見る
  }
  try {
    const tags = run("git ls-remote --tags --refs origin")
      .split("\n")
      .map((line) => line.split("refs/tags/")[1] ?? "");
    const latest = latestVersionTag(tags);
    if (latest) return latest;
  } catch {
    // オフラインなど
  }
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    return `v${pkg.version}`;
  } catch {
    return "v0.0.0";
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
