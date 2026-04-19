import { browser } from "$app/environment";

function createThemeStore() {
  let theme = $state<"light" | "dark">("light");

  if (browser) {
    const stored = localStorage.getItem("navcalc-theme");
    if (stored === "dark" || stored === "light") {
      theme = stored;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  }

  function toggle() {
    theme = theme === "dark" ? "light" : "dark";
    if (browser) localStorage.setItem("navcalc-theme", theme);
  }

  return {
    get current() {
      return theme;
    },
    toggle,
  };
}

export const themeStore = createThemeStore();
