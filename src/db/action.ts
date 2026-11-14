import { nanoid } from "nanoid";
import { DB } from "../lib";
import { normalizeLocale } from "../locales";
import migrateFrom2 from "./migrations/migrate2";
import { selectWidgets } from "./select";
import { BackgroundState, cache, db, WidgetDisplay } from "./state";

export const createId = (): string => nanoid(12);

// Background actions

/** Change the background */
export const inactiveUploadKey = "background/inactive-upload";
export const imageLinkKey = "background/image-link";
const inactiveLinkKey = "background/image-link/last-url";
const uploadKey = "background/image";

type InactiveUpload = { background: BackgroundState; index?: number };
let displayedUpload: { id: string; index: number } | undefined;

export function lastUploadIndex(id: string) {
  const saved = DB.get(cache, inactiveUploadKey) as InactiveUpload | undefined;
  return saved?.background.id === id ? saved.index : undefined;
}

export function rememberUploadIndex(id: string, index: number) {
  displayedUpload = { id, index };
  const saved = DB.get(cache, inactiveUploadKey) as InactiveUpload | undefined;
  if (saved?.background.id === id) DB.del(cache, inactiveUploadKey);
}

export const setBackground = (key: string): void => {
  const current = DB.get(db, "background");
  if (current.key === key) return;
  const saved =
    key === uploadKey
      ? (DB.get(cache, inactiveUploadKey) as InactiveUpload | undefined)
      : undefined;
  if (current.key === uploadKey) {
    const index =
      displayedUpload?.id === current.id ? displayedUpload.index : undefined;
    DB.put(cache, inactiveUploadKey, { background: current, index });
  } else {
    if (current.key === imageLinkKey) {
      const data = DB.get(db, `data/${current.id}`) as
        | { url?: string }
        | undefined;
      DB.put(db, inactiveLinkKey, data?.url ?? "");
    }
    DB.del(db, `data/${current.id}`);
    DB.del(cache, current.id);
  }

  const next = saved?.background ?? {
    id: createId(),
    key,
    display: { blur: 0, luminosity: -0.2 },
  };
  if (key === imageLinkKey) {
    const url = DB.get(db, inactiveLinkKey);
    if (typeof url === "string") DB.put(db, `data/${next.id}`, { url });
    DB.del(db, inactiveLinkKey);
  }
  DB.put(db, "background", next);
};

// Widget actions

/** Add a new widget */
export const addWidget = (key: string): void => {
  const id = createId();
  const widgets = selectWidgets();
  const order = widgets.length > 0 ? widgets[widgets.length - 1].order + 1 : 0;
  DB.put(db, `widget/${id}`, {
    id,
    key,
    order,
    display: { position: "middleCentre" },
  });
};

/** Remove a widget */
export const removeWidget = (id: string): void => {
  DB.put(db, `widget/${id}`, null);
  DB.del(db, `data/${id}`);
  DB.del(cache, id);
};

/** Reorder a widget */
export const reorderWidget = (from: number, to: number): void => {
  const widgets = selectWidgets();
  widgets.splice(to, 0, widgets.splice(from, 1)[0]);
  widgets.forEach((widget, order) =>
    DB.put(db, `widget/${widget.id}`, { ...widget, order }),
  );
};

/** Set display properties of a widget */
export const setWidgetDisplay = (
  id: string,
  display: Partial<WidgetDisplay>,
) => {
  const widget = DB.get(db, `widget/${id}`);
  if (!widget) throw new Error("Widget not found while");
  DB.put(db, `widget/${id}`, {
    ...widget,
    display: { ...widget.display, ...display },
  });
};

// UI actions

/** Toggle dashboard focus mode */
export const toggleFocus = () => {
  DB.put(db, "focus", !DB.get(db, "focus"));
};

// Store actions

/** Import database from a dump */
export const importStore = (dump: any): void => {
  // TODO: Add proper schema validation
  if (typeof dump !== "object" || dump === null)
    throw new TypeError("Unexpected format");

  if ("backgrounds" in dump) {
    // Version 2 config
    dump = {
      "widget/default-time": null,
      "widget/default-greeting": null,
      ...migrateFrom2(dump),
    };
  } else if (dump.version === 3) {
    // Version 3 config
    delete dump.version;
  } else if (dump.version > 3) {
    // Future version
    throw new TypeError("Settings exported from an newer version of Tabliss");
  } else {
    // Unknown version
    throw new TypeError("Unknown settings version");
  }
  const nbaIds = new Set(
    Object.entries(dump).flatMap(([key, value]) => {
      const widget = value as { key?: string } | null;
      return key.startsWith("widget/") && widget?.key === "widget/nba"
        ? [key.slice(7)]
        : [];
    }),
  );
  resetStore();
  Object.entries(dump).forEach(([key, value]) => {
    if (
      (key.startsWith("widget/") && nbaIds.has(key.slice(7))) ||
      (key.startsWith("data/") && nbaIds.has(key.slice(5)))
    )
      return;
    // Import includes dynamically keyed plugin state.
    DB.put(
      db,
      key as keyof import("./state").State,
      (key === "locale" ? normalizeLocale(value) : value) as never,
    );
  });
};

/** Export a database dump */
export const exportStore = (): string => {
  return JSON.stringify({
    ...Object.fromEntries(DB.prefix(db, "")),
    version: 3,
  });
};

/** Reset the database */
export const resetStore = (): void => {
  clear(db);
  clear(cache);
};

const clear = (db: DB.Database): void => {
  // @ts-ignore
  for (const [key] of DB.prefix(db, "")) DB.del(db, key);
};
