import { pick } from "in-browser-language";
import ko from "./lang/ko.json";

export const messages: Record<string, Record<string, string>> = { en: {}, ko };
export const locales = Object.keys(messages);
export const defaultLocale = pick(locales, "en");

export const normalizeLocale = (locale: unknown): string =>
  typeof locale === "string" && /^ko(?:-|$)/i.test(locale) ? "ko" : "en";
