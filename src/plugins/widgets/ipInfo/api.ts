import { API } from "../../types";
import { IpData } from "./types";

export async function getIpInfo(loader: API["loader"]): Promise<IpData> {
  loader.push();

  const data = await fetch("https://ipwho.is/")
    .then((res) => {
      if (!res.ok) throw new Error("IP lookup failed");
      return res.json();
    })
    .finally(() => loader.pop());

  if (data.success === false || !data.ip) throw new Error("No IP information");

  return {
    ip: data.ip,
    city: data.city,
    country: data.country,
  };
}
