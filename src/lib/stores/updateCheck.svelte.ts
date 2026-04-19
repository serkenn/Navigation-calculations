declare const __APP_VERSION__: string;

const GITHUB_API =
  "https://api.github.com/repos/serkenn/Navigation-calculations/releases/latest";
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
const DISMISS_KEY = "navcalc-update-dismissed";

function compareVersions(current: string, latest: string): boolean {
  const parse = (v: string) => v.replace(/^v/, "").split(".").map(Number);
  const c = parse(current);
  const l = parse(latest);
  for (let i = 0; i < 3; i++) {
    if ((l[i] ?? 0) > (c[i] ?? 0)) return true;
    if ((l[i] ?? 0) < (c[i] ?? 0)) return false;
  }
  return false;
}

class UpdateChecker {
  hasUpdate = $state(false);
  latestVersion = $state("");
  currentVersion = $state(__APP_VERSION__);
  releaseUrl = $state("");
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      // Web GUI (http/https) は push 時に自動デプロイされるため更新チェック不要
      const isWeb =
        window.location.protocol === "http:" ||
        window.location.protocol === "https:";
      if (!isWeb) {
        this.check();
        this.timer = setInterval(() => this.check(), CHECK_INTERVAL);
      }
    }
  }

  async check() {
    if (!navigator.onLine) return;

    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed) return;

    try {
      const res = await fetch(GITHUB_API, {
        headers: { Accept: "application/vnd.github.v3+json" },
        cache: "no-cache",
      });
      if (!res.ok) return;

      const data = await res.json();
      const tag = data.tag_name as string;

      if (compareVersions(this.currentVersion, tag)) {
        this.latestVersion = tag;
        this.releaseUrl = data.html_url;
        this.hasUpdate = true;
      }
    } catch {
      // offline or network error — silently ignore
    }
  }

  dismiss() {
    this.hasUpdate = false;
    sessionStorage.setItem(DISMISS_KEY, this.latestVersion);
  }
}

export const updateChecker = new UpdateChecker();
