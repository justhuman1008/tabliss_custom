import React from "react";
import { FormattedMessage } from "react-intl";
import { useCachedEffect } from "../../../hooks";
import { MINUTES } from "../../../utils";
import { getIpInfo } from "./api";
import { defaultData, Props } from "./types";

export default function IpInfo({
  cache,
  data = defaultData,
  setCache,
  loader,
}: Props) {
  const refreshedAt = cache?.provider === "ipwho.is" ? cache.timestamp : 0;
  const interval =
    (data.refreshInterval ?? defaultData.refreshInterval ?? 5) * MINUTES;
  useCachedEffect(
    () => {
      getIpInfo(loader)
        .then((result) =>
          setCache({ ...result, provider: "ipwho.is", timestamp: Date.now() }),
        )
        .catch(() =>
          setCache((previous) => ({
            ...previous,
            provider: "ipwho.is",
            timestamp: Date.now(),
          })),
        );
    },
    refreshedAt ? refreshedAt + interval : 0,
    [],
  );
  const ip = cache?.ip || data.ip;
  const city = data.displayCity && (cache?.city || data.city);
  const country = data.displayCountry && (cache?.country || data.country);
  return (
    <div className="IpInfo">
      {ip || (
        <FormattedMessage
          id="widget.ipInfo.fetching"
          defaultMessage="Fetching IP info…"
        />
      )}
      {city && ", " + city}
      {country && ", " + country}
    </div>
  );
}
