import type { Browser } from "webextension-polyfill";

declare global {
  const BUILD_TARGET: "chromium" | "firefox" | "web";
  const DEV: boolean;
  const UI_ICONS: Readonly<Record<string, string | undefined>>;

  const browser: Browser;
}
