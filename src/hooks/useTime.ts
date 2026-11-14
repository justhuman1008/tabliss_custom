import { useContext, useMemo, useSyncExternalStore } from "react";

import { Time, TimeContext } from "../contexts/time";

// Select a stable value so React only rerenders when it changes.
export function useTimeValue<T>(select: (time: Time) => T) {
  const store = useContext(TimeContext);
  return useSyncExternalStore(store.subscribe, () => select(store.getSnapshot()));
}

export function useTime(type: keyof Time = "zoned", period?: number) {
  const timestamp = useTimeValue((time) => {
    const now = time[type].getTime();
    return period ? Math.floor(now / period) * period : now;
  });
  return useMemo(() => new Date(timestamp), [timestamp]);
}

export function useTimeReached(deadline: number) {
  return useTimeValue(({ absolute }) => absolute.getTime() >= deadline);
}
