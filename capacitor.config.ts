import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.navcalc.app",
  appName: "NavCalc",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
