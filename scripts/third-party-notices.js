/**
 * 配布物に同梱する第三者ソフトウェアの著作権表示 (THIRD-PARTY-NOTICES.txt) を生成する。
 *
 * vite build の前に実行し、static/ に置くことで dist/ にそのまま取り込まれる（リポジトリ直下にも控えを出力）。
 * 対象は実行時に配布物へ含まれるパッケージ（Web バンドル・Node サーバー・Electron・Capacitor）。
 * ビルド専用のツール（vite, tailwindcss, typescript, svelte-check など）は配布物に入らないので対象外。
 * Chromium / Node 由来のライセンスは electron-builder が LICENSES.chromium.html として別途同梱する。
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const RUNTIME_PACKAGES = [
  "svelte",
  "@sveltejs/kit",
  "@lucide/svelte",
  "hono",
  "@hono/node-server",
  "@capacitor/core",
  "@capacitor/android",
  "@capacitor/ios",
  "electron",
];

const OUTPUT = "THIRD-PARTY-NOTICES.txt";

function readLicenseText(dir) {
  const candidate = readdirSync(dir).find((name) =>
    /^(LICENSE|LICENCE|COPYING)(\.|$)/i.test(name),
  );
  return candidate ? readFileSync(join(dir, candidate), "utf8").trim() : null;
}

const sections = [];
for (const name of RUNTIME_PACKAGES) {
  const dir = join("node_modules", name);
  if (!existsSync(dir)) {
    console.warn(`third-party-notices: ${name} が見つかりません（スキップ）`);
    continue;
  }
  const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  const license = pkg.license ?? "UNKNOWN";
  const homepage = pkg.homepage ?? pkg.repository?.url ?? "";
  const text =
    readLicenseText(dir) ??
    `(LICENSE file not included in the package; licensed under ${license})`;
  sections.push(
    [
      "=".repeat(78),
      `${pkg.name} ${pkg.version}`,
      `License: ${license}`,
      homepage ? `Homepage: ${homepage}` : null,
      "=".repeat(78),
      "",
      text,
      "",
    ]
      .filter((line) => line !== null)
      .join("\n"),
  );
}

const header = [
  "THIRD-PARTY SOFTWARE NOTICES",
  "",
  "NavCalc includes the following open source software. Each component is",
  "provided under its own license, reproduced below.",
  "",
  "Chromium, Node.js and Electron framework licenses are shipped separately",
  "with the desktop build as LICENSES.chromium.html.",
  "",
  "",
].join("\n");

const output = header + sections.join("\n\n");
writeFileSync(OUTPUT, output);
writeFileSync(join("static", OUTPUT), output);
console.log(
  `Wrote ${OUTPUT} (${sections.length} packages) to repo root and static/`,
);
