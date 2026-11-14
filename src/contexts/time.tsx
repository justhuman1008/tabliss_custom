import { utcToZonedTime } from "date-fns-tz";
import React from "react";
import { db } from "../db/state";
import { useValue } from "../lib/db/react";
import { SECONDS } from "../utils";

export type Time = {
  absolute: Date;
  zoned: Date;
};

function getTime(timeZone: string | null = null): Time {
  const absolute = new Date();
  const zoned = timeZone ? utcToZonedTime(absolute, timeZone) : absolute;

  return { absolute, zoned };
}

function createTimeStore(timeZone: string | null) {
  let current = getTime(timeZone);
  let timer: ReturnType<typeof setTimeout>;
  const listeners = new Set<() => void>();

  function update() {
    clearTimeout(timer);
    current = getTime(timeZone);
    listeners.forEach((listener) => listener());
    if (listeners.size) {
      timer = setTimeout(update, SECONDS - (Date.now() % SECONDS));
    }
  }

  return {
    getSnapshot: () => current,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) {
        document.addEventListener("visibilitychange", update);
        update();
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          clearTimeout(timer);
          document.removeEventListener("visibilitychange", update);
        }
      };
    },
  };
}

export const TimeContext = React.createContext(createTimeStore(null));

const TimeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const timeZone = useValue(db, "timeZone");
  const store = React.useMemo(() => createTimeStore(timeZone), [timeZone]);
  return <TimeContext.Provider value={store}>{children}</TimeContext.Provider>;
};

export default TimeProvider;
