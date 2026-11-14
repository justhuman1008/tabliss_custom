import React from "react";
import { useLocalCredential } from "../../../hooks/useLocalCredential";
import { useTimeReached, useTimeValue } from "../../../hooks/useTime";
import {
  weatherRequestSignal,
  hasWeatherLocation,
  loadAirKoreaStationDirectory,
  nearestAirKoreaStation,
  readAirKorea,
  readOpenMeteoAirQuality,
} from "./api";
import type {
  AirQuality,
  Cache,
  Coordinates,
  Directory,
  Props,
  Sample,
} from "./types";

export const publicDataKey = "tabliss.airKoreaServiceKey";
export const publicDataOrigin = "https://apis.data.go.kr/*";

export function usePublicDataKey(enabled: boolean) {
  return useLocalCredential<string>(publicDataKey, enabled, "");
}

export function usePublicDataPermission(enabled: boolean) {
  const [granted, setGranted] = React.useState<boolean>();
  React.useEffect(() => {
    if (!enabled || BUILD_TARGET === "web") return;
    const permissions = browser.permissions;
    let revision = 0;
    async function check() {
      const current = ++revision;
      let allowed = false;
      try {
        allowed = await permissions.contains({ origins: [publicDataOrigin] });
      } catch {}
      if (current === revision) setGranted(allowed);
    }
    permissions?.onAdded?.addListener(check);
    permissions?.onRemoved?.addListener(check);
    check();
    return () => {
      revision++;
      permissions?.onAdded?.removeListener(check);
      permissions?.onRemoved?.removeListener(check);
    };
  }, [enabled]);
  return enabled ? granted : undefined;
}

function useNearestAirKoreaStation(
  serviceKey: string | undefined,
  latitude: number | undefined,
  longitude: number | undefined,
) {
  const [directory, setDirectory] = React.useState<
    (Partial<Directory> & { serviceKey: string; expiresAt: number }) | null
  >(null);
  const current =
    directory && directory.serviceKey === serviceKey ? directory : null;
  const shouldLoad = useTimeReached(
    serviceKey ? current?.expiresAt ?? 0 : Infinity,
  );
  React.useEffect(() => {
    if (!serviceKey) {
      setDirectory(null);
      return;
    }
    if (!shouldLoad) return;
    let active = true;
    loadAirKoreaStationDirectory(serviceKey)
      .then((result) => {
        if (active) setDirectory({ ...result, serviceKey });
      })
      .catch(() => {
        if (active)
          setDirectory({ serviceKey, expiresAt: Date.now() + 300000 });
      });
    return () => {
      active = false;
    };
  }, [serviceKey, shouldLoad]);
  const stations = current?.stations;
  const station = React.useMemo(
    () => stations && nearestAirKoreaStation(stations, latitude, longitude),
    [stations, latitude, longitude],
  );
  return { station, stationError: Boolean(current && !stations) };
}

const airQualityHour = 3600000;
const airKoreaPollInterval = 180000;
const airKoreaPause = 1800000;

function completeAirKoreaSample(sample?: Sample): sample is Sample {
  return Number.isFinite(sample?.pm10) && Number.isFinite(sample?.pm25);
}

export function useAirQuality(
  { latitude, longitude }: Coordinates,
  useStation: boolean,
  showStation: boolean,
  showReadings: boolean,
  cache: Cache | undefined,
  setCache: Props["setCache"],
) {
  const hasLocation = hasWeatherLocation(latitude, longitude);
  const useAirKorea = useStation && (showStation || showReadings);
  const serviceKey = usePublicDataKey(useAirKorea);
  const publicDataAllowed = usePublicDataPermission(
    Boolean(useAirKorea && serviceKey),
  );
  const { station, stationError } = useNearestAirKoreaStation(
    publicDataAllowed && hasLocation ? serviceKey : undefined,
    latitude,
    longitude,
  );
  const locationKey = useStation
    ? `airkorea:${station}`
    : `${latitude}:${longitude}`;
  const saved =
    cache?.airQuality?.locationKey === locationKey ? cache.airQuality : null;
  const [failure, setFailure] = React.useState<{
    locationKey: string;
    serviceKey?: string;
    retryAt: number;
  } | null>(null);
  const failed =
    failure &&
    failure.locationKey === locationKey &&
    failure.serviceKey === serviceKey;
  const configured = useStation ? Boolean(station && serviceKey) : hasLocation;
  const maxAge = useStation ? 3 * airQualityHour : airQualityHour;
  const sample = useTimeValue(({ absolute }) => {
    const now = absolute.getTime();
    return configured
      ? saved?.samples.findLast(
          (row) => now >= row.timestamp && now < row.timestamp + maxAge,
        )
      : undefined;
  });
  let refreshAt = 0;
  if (failed && failure) refreshAt = failure.retryAt;
  else if (saved && !useStation) refreshAt = saved.fetchedAt + airQualityHour;
  else if (saved) {
    const pauseUntil =
      saved.pauseUntil ??
      (completeAirKoreaSample(sample) ? saved.fetchedAt + airKoreaPause : 0);
    refreshAt = Math.max(pauseUntil, saved.fetchedAt + airKoreaPollInterval);
  }
  const shouldRefresh = useTimeReached(
    showReadings && configured && (!useStation || publicDataAllowed)
      ? refreshAt
      : Infinity,
  );

  React.useEffect(() => {
    if (!shouldRefresh) return;
    const controller = new AbortController();
    const signal = weatherRequestSignal(controller.signal);
    const request = useStation
      ? readAirKorea(station!, serviceKey!, signal)
      : readOpenMeteoAirQuality(latitude!, longitude!, signal);
    request
      .then((samples) => {
        if (
          !samples.some(
            (sample) =>
              Number.isFinite(sample.pm10) || Number.isFinite(sample.pm25),
          )
        ) {
          throw new Error("No air quality readings");
        }
        if (!controller.signal.aborted) {
          const fetchedAt = Date.now();
          setCache((previous) => {
            const airQuality: AirQuality = { locationKey, fetchedAt, samples };
            if (useStation) {
              const last =
                previous?.airQuality?.locationKey === locationKey
                  ? previous.airQuality
                  : null;
              const latest = samples.findLast(
                (row) => row.timestamp <= fetchedAt,
              );
              const lastCompleteTime =
                last?.lastCompleteTime ??
                last?.samples.findLast(
                  (row) =>
                    row.timestamp <= fetchedAt && completeAirKoreaSample(row),
                )?.timestamp ??
                0;
              const receivedNewValues =
                completeAirKoreaSample(latest) &&
                latest.timestamp > lastCompleteTime;
              airQuality.lastCompleteTime = receivedNewValues
                ? latest.timestamp
                : lastCompleteTime;
              airQuality.pauseUntil = receivedNewValues
                ? fetchedAt + airKoreaPause
                : 0;
            }
            return { ...previous, airQuality };
          });
          setFailure(null);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setFailure({ locationKey, serviceKey, retryAt: Date.now() + 300000 });
      });
    return () => controller.abort();
  }, [locationKey, serviceKey, shouldRefresh]);

  const status =
    useStation && !hasLocation
      ? "location"
      : useStation && serviceKey === ""
        ? "setup"
        : useStation && publicDataAllowed === false
          ? "permission"
          : useStation && stationError
            ? "stationError"
            : useStation && showReadings && failed
              ? "error"
              : undefined;
  return { sample, station: useStation ? station : undefined, status };
}
