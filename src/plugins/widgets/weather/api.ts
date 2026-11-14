import type { Data, Directory, Grid, Region, Sample, Station } from "./types";
import type { Conditions } from "./conditions";
import { findCurrent } from "./conditions";

export function hasWeatherLocation(
  latitude?: number,
  longitude?: number,
): boolean {
  return (
    latitude !== undefined &&
    Number.isFinite(latitude) &&
    Math.abs(latitude) <= 90 &&
    longitude !== undefined &&
    Number.isFinite(longitude) &&
    Math.abs(longitude) <= 180
  );
}

export function weatherRequestSignal(
  parent: AbortSignal,
  timeoutMs = 10000,
): AbortSignal {
  const request = new AbortController();
  const timeout = setTimeout(() => request.abort(), timeoutMs);
  parent.addEventListener(
    "abort",
    () => {
      clearTimeout(timeout);
      request.abort();
    },
    { once: true },
  );
  return request.signal;
}

export function roundCoordinate(value: number): number {
  return Math.round(value * 1e4) / 1e4;
}

type PublicResponse<T> = {
  response?: { header?: { resultCode?: string }; body?: T };
};
type AirKoreaItem = {
  stationName?: string;
  dmX?: string;
  dmY?: string;
  dataTime?: string;
  pm10Value?: string;
  pm25Value?: string;
};
type KmaItem = {
  category: string;
  obsrValue: string;
  baseDate: string;
  baseTime: string;
  fcstDate: string;
  fcstTime: string;
  fcstValue: string;
};
type Forecast = {
  hourly: {
    time: number[];
    temperature_2m: number[];
    apparent_temperature: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
  };
};
type AirForecast = {
  hourly: {
    time: number[];
    pm10?: (number | null)[];
    pm2_5?: (number | null)[];
  };
};
type CitySearch = { results?: { latitude: number; longitude: number }[] };

class WeatherHttpError extends Error {
  constructor(readonly status: number) {
    super("Weather request returned HTTP " + status);
  }
}

async function getWeatherJSON<T>(
  endpoint: string,
  params: Record<string, string | number>,
  signal: AbortSignal,
  cache?: RequestCache,
): Promise<T> {
  const response = await fetch(
    endpoint +
      "?" +
      new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ),
    { signal, cache },
  );
  if (!response.ok) throw new WeatherHttpError(response.status);
  return response.json();
}

function airKoreaConcentration(value: unknown) {
  if (typeof value === "string" && value.trim()) value = Number(value);
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : null;
}

export async function readAirKorea(
  stationName: string,
  serviceKey: string,
  signal: AbortSignal,
): Promise<Sample[]> {
  const { response } = await getWeatherJSON<
    PublicResponse<{ items: AirKoreaItem[] }>
  >(
    "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty",
    {
      serviceKey,
      stationName,
      returnType: "json",
      dataTerm: "DAILY",
      numOfRows: 24,
      pageNo: 1,
      ver: "1.3",
    },
    signal,
    "no-store",
  );
  if (
    response?.header?.resultCode !== "00" ||
    !Array.isArray(response.body?.items)
  )
    throw new Error("AirKorea request failed");
  return response.body.items
    .map((item) => ({
      timestamp: Date.parse(item.dataTime?.replace(" ", "T") + ":00+09:00"),
      pm10: airKoreaConcentration(item.pm10Value),
      pm25: airKoreaConcentration(item.pm25Value),
    }))
    .filter((sample) => Number.isFinite(sample.timestamp))
    .sort((left, right) => left.timestamp - right.timestamp);
}

const airKoreaStationCacheKey = "tabliss.airKoreaStationDirectory";
const airKoreaStationCacheTime = 86400000;
let airKoreaDirectoryRequest:
  | { serviceKey: string; promise: Promise<Directory> }
  | undefined;

async function fetchAirKoreaStationDirectory(
  serviceKey: string,
): Promise<Directory> {
  const stations = [];
  const signal = AbortSignal.timeout(15000);
  let remaining = 0;
  for (let pageNo = 1; ; pageNo++) {
    const { response } = await getWeatherJSON<
      PublicResponse<{ items: AirKoreaItem[]; totalCount: number }>
    >(
      "https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList",
      { serviceKey, returnType: "json", numOfRows: 1000, pageNo },
      signal,
    );
    const items = response?.body?.items;
    if (
      response?.header?.resultCode !== "00" ||
      !Array.isArray(items) ||
      !items.length
    ) {
      throw new Error("AirKorea station list unavailable");
    }
    if (pageNo === 1) {
      remaining = Number(response.body?.totalCount);
      if (!Number.isSafeInteger(remaining) || remaining < items.length)
        throw new Error("Invalid AirKorea station count");
    }
    for (const item of items) {
      const name =
        typeof item?.stationName === "string" ? item.stationName.trim() : "";
      const latitude = Number(item?.dmX);
      const longitude = Number(item?.dmY);
      if (
        name &&
        hasWeatherLocation(latitude, longitude) &&
        latitude !== 0 &&
        longitude !== 0
      ) {
        stations.push({ name, latitude, longitude });
      }
    }
    remaining -= items.length;
    if (remaining <= 0) break;
  }
  if (!stations.length) throw new Error("No AirKorea station coordinates");
  return { stations, expiresAt: Date.now() + airKoreaStationCacheTime };
}

export function loadAirKoreaStationDirectory(
  serviceKey: string,
): Promise<Directory> {
  if (airKoreaDirectoryRequest?.serviceKey === serviceKey)
    return airKoreaDirectoryRequest.promise;
  const promise = (async () => {
    const storage = browser.storage.local;
    const items = await storage.get(airKoreaStationCacheKey).catch(() => ({}));
    const cached = (items as Record<string, Directory>)[
      airKoreaStationCacheKey
    ];
    if (
      cached &&
      cached.expiresAt > Date.now() &&
      Array.isArray(cached.stations) &&
      cached.stations.length
    )
      return cached;
    const directory = await fetchAirKoreaStationDirectory(serviceKey);
    await storage.set({ [airKoreaStationCacheKey]: directory }).catch(() => {});
    return directory;
  })().finally(() => {
    if (airKoreaDirectoryRequest === request)
      airKoreaDirectoryRequest = undefined;
  });
  const request = { serviceKey, promise };
  airKoreaDirectoryRequest = request;
  return promise;
}

export function nearestAirKoreaStation(
  stations: Station[],
  latitude?: number,
  longitude?: number,
) {
  if (latitude === undefined || longitude === undefined) return undefined;
  const radians = Math.PI / 180;
  const latitudeCosine = Math.cos(latitude * radians);
  let nearest;
  let shortest = Infinity;
  for (const station of stations) {
    const latitudeDelta = (station.latitude - latitude) * radians;
    const longitudeDelta = (station.longitude - longitude) * radians;
    const distance =
      Math.sin(latitudeDelta / 2) ** 2 +
      latitudeCosine *
        Math.cos(station.latitude * radians) *
        Math.sin(longitudeDelta / 2) ** 2;
    if (distance < shortest) {
      shortest = distance;
      nearest = station.name;
    }
  }
  return nearest;
}

export async function readOpenMeteoAirQuality(
  latitude: number,
  longitude: number,
  signal: AbortSignal,
): Promise<Sample[]> {
  const { hourly } = await getWeatherJSON<AirForecast>(
    "https://air-quality-api.open-meteo.com/v1/air-quality",
    {
      latitude,
      longitude,
      hourly: "pm10,pm2_5",
      timeformat: "unixtime",
      forecast_days: 2,
    },
    signal,
  );
  return hourly.time.map((time, index) => ({
    timestamp: time * 1000,
    pm10: hourly.pm10?.[index],
    pm25: hourly.pm2_5?.[index],
  }));
}

// KMA 5 km Lambert conformal grid, with the published (43, 136) origin.
export function kmaGrid(latitude?: number, longitude?: number) {
  if (
    latitude === undefined ||
    longitude === undefined ||
    !hasWeatherLocation(latitude, longitude)
  )
    return null;
  const radians = Math.PI / 180;
  const first = 30 * radians,
    second = 60 * radians;
  const tangent = (angle: number) => Math.tan(Math.PI / 4 + angle / 2);
  const cone =
    Math.log(Math.cos(first) / Math.cos(second)) /
    Math.log(tangent(second) / tangent(first));
  const scale =
    ((6371.00877 / 5) * Math.cos(first) * tangent(first) ** cone) / cone;
  const radius = scale / tangent(latitude * radians) ** cone;
  const angle = (longitude - 126) * radians * cone;
  const x = Math.round(43 + radius * Math.sin(angle));
  const y = Math.round(
    136 + scale / tangent(38 * radians) ** cone - radius * Math.cos(angle),
  );
  return x >= 1 && x <= 149 && y >= 1 && y <= 253 ? { nx: x, ny: y } : null;
}

export const kmaHour = 3600000;
function kmaBaseTime(now: number, forecast: boolean) {
  // Wait for publication, then use the documented hourly slots in KST.
  const delay = forecast ? 45 : 10;
  const date = new Date(
    Math.floor((now - delay * 60000) / kmaHour) * kmaHour + 9 * kmaHour,
  );
  const iso = date.toISOString();
  return {
    base_date: iso.slice(0, 10).replaceAll("-", ""),
    base_time: iso.slice(11, 13) + (forecast ? "30" : "00"),
  };
}

function kmaTimestamp(date: string, time: string) {
  if (!/^\d{8}$/.test(date) || !/^\d{4}$/.test(time)) return NaN;
  return Date.parse(
    `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:00+09:00`,
  );
}

async function readKmaItems(
  operation: "getUltraSrtFcst" | "getUltraSrtNcst",
  grid: Grid,
  serviceKey: string,
  now: number,
  signal: AbortSignal,
) {
  const forecast = operation === "getUltraSrtFcst";
  for (const offset of [0, kmaHour]) {
    const { response } = await getWeatherJSON<
      PublicResponse<{ items: { item: KmaItem[] } }>
    >(
      "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/" + operation,
      {
        serviceKey,
        dataType: "JSON",
        numOfRows: 100,
        pageNo: 1,
        ...grid,
        ...kmaBaseTime(now - offset, forecast),
      },
      signal,
    );
    const result = response?.header?.resultCode;
    const items = response?.body?.items?.item;
    if (result === "00" && Array.isArray(items) && items.length) return items;
    if (result !== "03" && result !== "00")
      throw new Error("KMA request failed");
  }
  throw new Error("KMA data is unavailable");
}

function kmaNumber(value: unknown, min: number, max: number) {
  if (typeof value === "string" && value.trim()) value = Number(value);
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max
    ? value
    : null;
}

function kmaFeelsLike(
  temperature: number,
  humidity: number | null,
  windSpeed: number | null,
  month: number,
) {
  // KMA's published summer and winter formulas, using Celsius and km/h.
  if (month >= 5 && month <= 9) {
    if (humidity === null) return null;
    const wetBulb =
      temperature * Math.atan(0.151977 * Math.sqrt(humidity + 8.313659)) +
      Math.atan(temperature + humidity) -
      Math.atan(humidity - 1.67633) +
      0.00391838 * humidity ** 1.5 * Math.atan(0.023101 * humidity) -
      4.686035;
    return (
      -0.2442 +
      0.55399 * wetBulb +
      0.45535 * temperature -
      0.0022 * wetBulb ** 2 +
      0.00278 * wetBulb * temperature +
      3
    );
  }
  if (windSpeed === null) return null;
  const speed = windSpeed * 3.6;
  if (temperature > 10 || speed < 4.8) return temperature;
  const wind = speed ** 0.16;
  return (
    13.12 + 0.6215 * temperature - 11.37 * wind + 0.3965 * wind * temperature
  );
}

function kmaWeatherCode(
  precipitation: number | null,
  sky: number | null,
  lightning: number | null,
) {
  if (lightning && lightning > 0) return 95;
  const rainOrSnow: Record<number, number> = {
    1: 61,
    2: 71,
    3: 71,
    4: 80,
    5: 51,
    6: 71,
    7: 71,
  };
  const cloudCover: Record<number, number> = { 1: 0, 3: 2, 4: 3 };
  return (
    (precipitation === null ? undefined : rainOrSnow[precipitation]) ??
    (sky === null ? undefined : cloudCover[sky])
  );
}

export async function readKmaWeather(
  grid: Grid,
  serviceKey: string,
  now: number,
  signal: AbortSignal,
): Promise<Conditions[]> {
  const [observations, forecast] = await Promise.all([
    readKmaItems("getUltraSrtNcst", grid, serviceKey, now, signal),
    readKmaItems("getUltraSrtFcst", grid, serviceKey, now, signal).catch(
      () => [],
    ),
  ]);
  const values = Object.fromEntries(
    observations.map((item) => [item.category, item.obsrValue]),
  );
  const temperature = kmaNumber(values.T1H, -90, 65);
  if (temperature === null) throw new Error("Missing KMA temperature");
  const humidity = kmaNumber(values.REH, 0, 100);
  const wind = kmaNumber(values.WSD, 0, 150);
  const observationTime = kmaTimestamp(
    observations[0].baseDate,
    observations[0].baseTime,
  );
  const timestamp = Number.isFinite(observationTime) ? observationTime : now;
  const currentHour = Math.floor(now / kmaHour) * kmaHour;
  const upcoming = new Map<number, Record<string, string>>();
  for (const item of forecast) {
    const time = kmaTimestamp(item.fcstDate, item.fcstTime);
    if (!Number.isFinite(time)) continue;
    if (!upcoming.has(time)) upcoming.set(time, {});
    upcoming.get(time)![item.category] = item.fcstValue;
  }
  const sky =
    upcoming.get(currentHour) ?? upcoming.get(currentHour + kmaHour) ?? {};
  const precipitation = kmaNumber(values.PTY, 0, 7) ?? kmaNumber(sky.PTY, 0, 7);
  const feelsLike = kmaFeelsLike(
    temperature,
    humidity,
    wind,
    new Date(timestamp + 9 * kmaHour).getUTCMonth() + 1,
  );
  return [
    {
      timestamp,
      temperature,
      apparentTemperature: feelsLike,
      humidity,
      weatherCode: kmaWeatherCode(
        precipitation,
        kmaNumber(sky.SKY, 1, 4),
        kmaNumber(sky.LGT, 0, 999),
      ),
    },
  ];
}

export async function readOpenMeteoWeather(
  latitude: number,
  longitude: number,
  units: Data["units"],
  signal: AbortSignal,
): Promise<Conditions[]> {
  const params = {
    latitude,
    longitude,
    hourly:
      "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code",
    timeformat: "unixtime",
    temperature_unit: units === "us" ? "fahrenheit" : "celsius",
    forecast_days: 2,
  };

  async function load(endpoint: string, timeoutMs: number) {
    const { hourly } = await getWeatherJSON<Forecast>(
      endpoint,
      params,
      weatherRequestSignal(signal, timeoutMs),
    );
    const conditions = hourly.time
      .map((timestamp, index) => ({
        timestamp: 1000 * timestamp,
        temperature: hourly.temperature_2m[index],
        apparentTemperature: hourly.apparent_temperature[index],
        humidity: hourly.relative_humidity_2m[index],
        weatherCode: hourly.weather_code[index],
      }))
      .filter((condition) => Number.isFinite(condition.temperature));
    const now = Date.now();
    const current = findCurrent(conditions, now);
    if (!current || now - current.timestamp >= 2 * kmaHour)
      throw new Error("Open-Meteo returned no forecast for the current hour");
    return conditions;
  }

  try {
    return await load("https://api.open-meteo.com/v1/forecast", 6000);
  } catch (error) {
    if (
      signal.aborted ||
      (error instanceof WeatherHttpError && error.status < 500)
    )
      throw error;
    // The Previous Runs API serves the current model run for unsuffixed variables.
    return load("https://previous-runs-api.open-meteo.com/v1/forecast", 10000);
  }
}

let kmaLocationsRequest: Promise<Region[]> | undefined;

export function loadKmaLocations() {
  kmaLocationsRequest ??= fetch(
    new URL("kma-forecast-locations.json", location.href),
    { signal: AbortSignal.timeout(10000) },
  )
    .then((response) => {
      if (!response.ok) throw new Error("KMA location directory unavailable");
      return response.json();
    })
    .then(({ locations }) => {
      if (!Array.isArray(locations) || !locations.length)
        throw new Error("KMA location directory is empty");
      return locations;
    })
    .catch((error) => {
      kmaLocationsRequest = undefined;
      throw error;
    });
  return kmaLocationsRequest;
}

function normalizeKmaLocation(name: string) {
  return name.normalize("NFKC").replace(/\s+/g, "");
}

export function findKmaLocations(locations: Region[], query: string) {
  const name = normalizeKmaLocation(query);
  if (!name) return [];
  const matches = new Map<
    string,
    {
      latitude: number;
      longitude: number;
      name: string;
      kmaGrid: Grid & { latitude: number; longitude: number };
    }
  >();
  for (const [
    region,
    district,
    locality,
    latitude,
    longitude,
    nx,
    ny,
  ] of locations) {
    const shortRegion = region.replace(
      /특별자치시$|특별자치도$|특별시$|광역시$/u,
      "",
    );
    const localName = locality || district || region;
    const relativeName = [district, locality].filter(Boolean).join(" ");
    const fullName = [region, district, locality].filter(Boolean).join(" ");
    const shortName = [shortRegion, district, locality]
      .filter(Boolean)
      .join(" ");
    if (
      ![localName, relativeName, fullName, shortName].some(
        (alias) => normalizeKmaLocation(alias) === name,
      )
    )
      continue;
    const result = {
      latitude,
      longitude,
      name: fullName,
      kmaGrid: { nx, ny, latitude, longitude },
    };
    const key = `${fullName}:${nx}:${ny}`;
    if (!matches.has(key)) matches.set(key, result);
  }
  return [...matches.values()];
}

export async function findOpenMeteoLocations(name: string, language: string) {
  if (/\p{Script=Hangul}/u.test(name)) {
    const directory = await loadKmaLocations().catch(() => []);
    const matches = findKmaLocations(directory, name);
    if (matches.length) return matches;
  }

  const endpoint = "https://geocoding-api.open-meteo.com/v1/search";
  const signal = AbortSignal.timeout(10000);
  const search = (name: string) =>
    getWeatherJSON<CitySearch>(endpoint, { name, count: 1, language }, signal);
  let result = (await search(name)).results?.[0];
  if (!result && name === "서울") {
    result = (await search("서울특별시")).results?.[0];
  }
  if (!result || !hasWeatherLocation(result.latitude, result.longitude))
    return [];
  return [
    {
      latitude: roundCoordinate(result.latitude),
      longitude: roundCoordinate(result.longitude),
      name,
    },
  ];
}
