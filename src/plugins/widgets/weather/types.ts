import { API } from "../../types";
import { Conditions } from "./conditions";

export type Coordinates = { latitude?: number; longitude?: number };
export type Grid = { nx: number; ny: number };
export type WeatherSource = "kma" | "open-meteo";
export type Detail =
  | "apparent"
  | "humidity"
  | "pm10"
  | "pm25"
  | "station"
  | "measurementTime";
export type Fields = Partial<Record<Detail, boolean>>;
export type Data = Coordinates & {
  name?: string;
  showDetails: boolean;
  units: "auto" | "si" | "us";
  weatherSource?: WeatherSource;
  airQualitySource?: string;
  kmaGrid?: Grid & Coordinates;
  detailFields?: Fields;
};
export type Sample = {
  timestamp: number;
  pm10?: number | null;
  pm25?: number | null;
};
export type Station = { name: string; latitude: number; longitude: number };
export type Directory = { stations: Station[]; expiresAt: number };
export type Region = [string, string, string, number, number, number, number];
export type Location = Coordinates & {
  name?: string;
  kmaGrid?: Grid & Coordinates;
};
export type AirQuality = {
  locationKey: string;
  fetchedAt: number;
  samples: Sample[];
  lastCompleteTime?: number;
  pauseUntil?: number;
};
export type Cache = {
  timestamp?: number;
  requestKey?: string;
  conditions?: Conditions[];
  airQuality?: AirQuality;
};
export type Props = API<Data, Cache>;
export const defaultData: Data = { showDetails: false, units: "si" };
