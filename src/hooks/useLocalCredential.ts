import { useEffect, useState } from "react";

const credentialEvent = "tabliss-credential-changed";

export async function writeLocalCredential<T>(key: string, value?: T) {
  if (BUILD_TARGET !== "web") {
    if (value === undefined) await browser.storage.local.remove(key);
    else await browser.storage.local.set({ [key]: value });
    return;
  }
  if (value === undefined) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(credentialEvent));
}

export function useLocalCredential<T>(key: string, enabled = true, empty?: T) {
  const [value, setValue] = useState<T>();
  useEffect(() => {
    if (!enabled) return;
    if (BUILD_TARGET === "web") {
      const read = () => {
        try {
          const stored = localStorage.getItem(key);
          setValue(stored === null ? empty : JSON.parse(stored));
        } catch {
          setValue(empty);
        }
      };
      read();
      window.addEventListener("storage", read);
      window.addEventListener(credentialEvent, read);
      return () => {
        window.removeEventListener("storage", read);
        window.removeEventListener(credentialEvent, read);
      };
    }
    let current = true;
    const onChanged: Parameters<
      typeof browser.storage.onChanged.addListener
    >[0] = (changes, area) => {
      if (
        area === "local" &&
        Object.prototype.hasOwnProperty.call(changes, key)
      ) {
        current = false;
        setValue(changes[key].newValue ?? empty);
      }
    };
    browser.storage.onChanged.addListener(onChanged);
    browser.storage.local
      .get(key)
      .then((items) => {
        if (current) setValue(items[key] ?? empty);
      })
      .catch(() => {
        if (current) setValue(empty);
      });
    return () => {
      current = false;
      browser.storage.onChanged.removeListener(onChanged);
    };
  }, [key, enabled, empty]);
  return enabled ? value : undefined;
}
