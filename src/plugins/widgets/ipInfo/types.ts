import { API } from "../../types";

type Data = {
  refreshInterval?: number;
  ip?: string;
  city?: string;
  country?: string;
  displayCity: boolean;
  displayCountry: boolean;
};

export type IpData = {
  ip: string;
  city: string;
  country: string;
};

type Cache = Partial<IpData> & { provider?: string; timestamp?: number };

export type Props = API<Data, Cache>;

export const defaultData: Data = {
  refreshInterval: 5,
  displayCity: true,
  displayCountry: true,
};
