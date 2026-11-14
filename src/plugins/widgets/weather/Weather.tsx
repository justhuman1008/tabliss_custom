import React from "react";
import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { useFormatMessages, useTimeReached, useTimeValue } from "../../../hooks";
import { Icon } from "../../../views/shared";
import {
  weatherRequestSignal,
  hasWeatherLocation,
  kmaGrid,
  kmaHour,
  readKmaWeather,
  readOpenMeteoWeather,
} from "./api";
import { weatherCodes } from "./conditions";
import AirQualityDetails from "./AirQualityDetails";
import {
  useAirQuality,
  usePublicDataKey,
  usePublicDataPermission,
} from "./useAirQuality";
import { getWeatherSource, weatherDetailFields } from "./weatherOptions";
import { defaultData, Props } from "./types";
import "./Weather.sass";

export default function Weather({
  cache,
  data = defaultData,
  loader,
  setCache,
  setData,
}: Props) {
  const useKma = getWeatherSource(data) === "kma";
  const fields = weatherDetailFields(data);
  const detailsOpen = data.showDetails === true;
  const showStation = useKma && Boolean(fields.station);
  const showReadings = Boolean(
    fields.pm10 || fields.pm25 || (useKma && fields.measurementTime),
  );
  const showAirQuality = detailsOpen && (showStation || showReadings);
  const airQuality = useAirQuality(
    data,
    useKma,
    detailsOpen && showStation,
    detailsOpen && showReadings,
    cache,
    setCache,
  );
  const translated = useFormatMessages(messages),
    { formatMessage } = useIntl();
  const { latitude, longitude } = data;
  const units = useKma ? "si" : data.units;
  const serviceKey = usePublicDataKey(useKma);
  const publicDataAllowed = usePublicDataPermission(
    Boolean(useKma && serviceKey),
  );
  const savedGrid = data.kmaGrid;
  const grid = useKma
    ? savedGrid?.latitude === latitude &&
      savedGrid?.longitude === longitude &&
      savedGrid
      ? savedGrid
      : kmaGrid(latitude, longitude)
    : null;
  const requestKey = useKma
    ? `kma:${grid?.nx}:${grid?.ny}:${units}`
    : `${latitude}:${longitude}:${units}`;
  const cached = cache?.requestKey === requestKey ? cache : null;
  const [failure, setFailure] = React.useState<{
    key: string;
    serviceKey?: string;
    retryAt: number;
  } | null>(null);
  const failed =
    failure && failure.key === requestKey && failure.serviceKey === serviceKey;
  const refreshAt =
    failed && failure
      ? failure.retryAt
      : cached?.timestamp
        ? cached.timestamp + (useKma ? 600000 : 216e5)
        : 0;
  const configured = useKma
    ? Boolean(grid && serviceKey)
    : hasWeatherLocation(latitude, longitude);
  const shouldRefresh = useTimeReached(
    configured && (!useKma || publicDataAllowed) ? refreshAt : Infinity,
  );
  React.useEffect(() => {
    if (!shouldRefresh) return;
    const controller = new AbortController();
    loader.push();
    const request = useKma
      ? readKmaWeather(
          grid!,
          serviceKey!,
          Date.now(),
          weatherRequestSignal(controller.signal),
        )
      : readOpenMeteoWeather(latitude!, longitude!, units, controller.signal);
    request
      .then((conditions) => {
        if (!conditions.length) throw new Error("Empty weather forecast");
        if (!controller.signal.aborted) {
          setCache((previous) => ({
            ...previous,
            requestKey,
            timestamp: Date.now(),
            conditions,
          }));
          setFailure(null);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setFailure({
            key: requestKey,
            serviceKey,
            retryAt: Date.now() + 300000,
          });
      })
      .finally(loader.pop);
    return () => controller.abort();
  }, [requestKey, serviceKey, shouldRefresh]);

  const conditions = useTimeValue(({ absolute }) => {
    const now = absolute.getTime();
    return configured
      ? cached?.conditions?.findLast(
          (condition) =>
            now >= condition.timestamp &&
            (!useKma || now < condition.timestamp + 2 * kmaHour),
        )
      : null;
  });
  const weatherStatus =
    useKma && hasWeatherLocation(latitude, longitude) && !grid
      ? React.createElement(FormattedMessage, {
          id: "widget.weather.kmaOutside",
          defaultMessage:
            "Choose a location covered by the KMA local forecast.",
        })
      : useKma && serviceKey === "" && Boolean(grid)
        ? React.createElement(FormattedMessage, {
            id: "widget.weather.kmaSetup",
            defaultMessage:
              "Save a Public Data Portal key in Weather settings.",
          })
        : useKma && publicDataAllowed === false && Boolean(grid)
          ? React.createElement(FormattedMessage, {
              id: "widget.weather.airQuality.permission",
              defaultMessage:
                "Allow access to the Public Data Portal in Weather settings.",
            })
          : failed
            ? React.createElement(
                FormattedMessage,
                useKma
                  ? {
                      id: "widget.weather.kmaError",
                      defaultMessage:
                        "Could not load KMA weather. Check the location and forecast API access for your key.",
                    }
                  : {
                      id: "widget.weather.forecastError",
                      defaultMessage: "Weather data is unavailable.",
                    },
              )
            : "-";
  const airDetails =
    showAirQuality &&
    React.createElement(AirQualityDetails, {
      ...airQuality,
      fields: { ...fields, measurementTime: useKma && fields.measurementTime },
    });
  if (!conditions) {
    return React.createElement(
      "div",
      { className: "Weather" },
      weatherStatus,
      useKma &&
        airDetails &&
        React.createElement("div", { className: "details" }, airDetails),
    );
  }
  const hasDetails =
    fields.apparent || fields.humidity || showStation || showReadings;
  const canToggleDetails = !data.detailFields || hasDetails;
  const toggleDetails = canToggleDetails
    ? () =>
        setData({
          ...data,
          showDetails: !detailsOpen,
          detailFields:
            data.detailFields ?? weatherDetailFields({ showDetails: true }),
        })
    : undefined;
  return React.createElement(
    "div",
    { className: "Weather" },
    React.createElement(
      "div",
      {
        className: "summary",
        onClick: toggleDetails,
        title: canToggleDetails
          ? formatMessage({
              id: "widget.weather.toggleDetails",
              defaultMessage: "Toggle weather details",
            })
          : undefined,
        style: canToggleDetails ? undefined : { cursor: "default" },
      },
      data.name ? React.createElement("span", null, data.name) : null,
      conditions.weatherCode !== undefined &&
        weatherCodes[conditions.weatherCode] &&
        React.createElement(Icon, {
          name: weatherCodes[conditions.weatherCode],
        }),
      React.createElement(
        "span",
        { className: "temperature" },
        Math.round(conditions.temperature),
        "˚",
      ),
    ),
    detailsOpen &&
      hasDetails &&
      React.createElement(
        "div",
        { className: "details" },
        fields.apparent &&
          React.createElement(
            "dl",
            null,
            React.createElement(
              "dt",
              null,
              conditions.apparentTemperature !== null &&
                Number.isFinite(conditions.apparentTemperature)
                ? Math.round(conditions.apparentTemperature) + "˚"
                : "—",
            ),
            React.createElement("dd", null, translated.apparent),
          ),
        fields.humidity &&
          React.createElement(
            "dl",
            null,
            React.createElement(
              "dt",
              null,
              conditions.humidity !== null &&
                Number.isFinite(conditions.humidity)
                ? conditions.humidity + "%"
                : "—",
            ),
            React.createElement("dd", null, translated.humidity),
          ),
        airDetails,
      ),
  );
}

const messages = defineMessages({
  high: {
    id: "plugins.weather.high",
    description: "High for temperature high",
    defaultMessage: "High",
  },
  low: {
    id: "plugins.weather.low",
    description: "Low for temperature low",
    defaultMessage: "Low",
  },
  apparent: {
    id: "plugins.weather.apparent",
    description: "Apparent/Feels like tempurature",
    defaultMessage: "Feels like",
  },
  humidity: {
    id: "plugins.weather.humidity",
    description: "Humidity",
    defaultMessage: "Humidity",
  },
});
