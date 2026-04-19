import { readFileSync, writeFileSync, copyFileSync } from "fs";

// Copy offline server into dist for zip distribution
copyFileSync("scripts/offline-server.cjs", "dist/server.cjs");
console.log("Copied offline server to dist/");
