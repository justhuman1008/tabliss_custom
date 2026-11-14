import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import type { Data, Detail, Fields, WeatherSource } from "./types";
export function getWeatherSource({
  weatherSource,
  airQualitySource,
}: Pick<Data, "weatherSource" | "airQualitySource">): WeatherSource {
  // Keep the Korean providers selected for older settings that used either one.
  return weatherSource === "kma" || airQualitySource === "airkorea"
    ? "kma"
    : "open-meteo";
}

export function WeatherSourceSettings({
  source,
  onSource,
}: {
  source: WeatherSource;
  onSource: (source: WeatherSource) => void;
}) {
  const { formatMessage } = useIntl();
  return React.createElement(
    "label",
    null,
    React.createElement(FormattedMessage, {
      id: "widget.weather.source",
      defaultMessage: "Weather and air quality source",
    }),
    React.createElement(
      "select",
      {
        value: source,
        onChange: (event: React.ChangeEvent<HTMLSelectElement>) =>
          onSource(event.target.value as WeatherSource),
      },
      React.createElement("option", { value: "open-meteo" }, "Open-Meteo"),
      React.createElement(
        "option",
        { value: "kma" },
        formatMessage({
          id: "widget.weather.kma",
          defaultMessage: "KMA · AirKorea",
        }),
      ),
    ),
  );
}

const weatherDetailOptions: {
  key: Detail;
  id: string;
  defaultMessage: string;
  requiresAirKorea?: boolean;
}[] = [
  {
    key: "apparent",
    id: "widget.weather.detail.apparent",
    defaultMessage: "Feels like",
  },
  {
    key: "humidity",
    id: "plugins.weather.humidity",
    defaultMessage: "Humidity",
  },
  {
    key: "pm10",
    id: "widget.weather.pm10",
    defaultMessage: "Particulate matter (PM10)",
  },
  {
    key: "pm25",
    id: "widget.weather.pm25",
    defaultMessage: "Fine particulate matter (PM2.5)",
  },
  {
    key: "station",
    id: "widget.weather.detail.station",
    defaultMessage: "Station",
    requiresAirKorea: true,
  },
  {
    key: "measurementTime",
    id: "widget.weather.detail.measurementTime",
    defaultMessage: "Measurement time",
    requiresAirKorea: true,
  },
];

export function weatherDetailFields(
  data: Pick<Data, "detailFields" | "showDetails">,
): Fields {
  return (
    data.detailFields ??
    Object.fromEntries(
      weatherDetailOptions.map(({ key }) => [key, Boolean(data.showDetails)]),
    )
  );
}

export function WeatherDetailSettings({
  data,
  setData,
  useAirKorea,
}: {
  data: Data;
  setData: (data: Data) => void;
  useAirKorea: boolean;
}) {
  const fields = weatherDetailFields(data);
  const options = weatherDetailOptions.filter(
    (option) => !option.requiresAirKorea || useAirKorea,
  );
  return React.createElement(
    "fieldset",
    { className: "weather-setting-group" },
    React.createElement(
      "legend",
      null,
      React.createElement(FormattedMessage, {
        id: "widget.weather.detail.group",
        defaultMessage: "Show details",
      }),
    ),
    options.map(({ key, id, defaultMessage }) =>
      React.createElement(
        "label",
        { key },
        React.createElement("input", {
          type: "checkbox",
          checked: Boolean(fields[key]),
          onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
            setData({
              ...data,
              showDetails: true,
              detailFields: { ...fields, [key]: event.target.checked },
            }),
        }),
        " ",
        React.createElement(FormattedMessage, { id, defaultMessage }),
      ),
    ),
  );
}
