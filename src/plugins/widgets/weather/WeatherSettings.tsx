import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { hasWeatherLocation } from "./api";
import LocationInput from "./LocationInput";
import PublicDataKeySettings from "./PublicDataKeySettings";
import {
  getWeatherSource,
  WeatherDetailSettings,
  WeatherSourceSettings,
} from "./weatherOptions";
import { defaultData, Props } from "./types";

export default function WeatherSettings({
  data: t = defaultData,
  setData: n,
}: Props) {
  const { formatMessage } = useIntl();
  const weatherSource = getWeatherSource(t);
  return React.createElement(
    "div",
    { className: "WeatherSettings" },
    React.createElement(WeatherSourceSettings, {
      source: weatherSource,
      onSource: (weatherSource) =>
        n({ ...t, weatherSource, airQualitySource: undefined }),
    }),
    weatherSource === "kma" && React.createElement(PublicDataKeySettings),
    React.createElement(LocationInput, {
      latitude: t.latitude,
      longitude: t.longitude,
      weatherSource,
      onChange: (location) => n({ ...t, kmaGrid: undefined, ...location }),
    }),
    hasWeatherLocation(t.latitude, t.longitude)
      ? React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "label",
            null,
            React.createElement(FormattedMessage, {
              id: "widget.weather.name",
              defaultMessage: "Name",
            }),
            React.createElement("input", {
              type: "text",
              value: t.name || "",
              placeholder: formatMessage({
                id: "widget.weather.optionalName",
                defaultMessage: "Optional name",
              }),
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                n({ ...t, name: event.target.value || undefined }),
            }),
          ),
          React.createElement("hr", null),
          React.createElement(
            "fieldset",
            { className: "weather-setting-group" },
            React.createElement(
              "legend",
              null,
              React.createElement(FormattedMessage, {
                id: "widget.weather.units",
                defaultMessage: "Units",
              }),
            ),
            React.createElement(
              "label",
              null,
              React.createElement("input", {
                type: "radio",
                checked: weatherSource === "kma" || t.units !== "us",
                onChange: () => n({ ...t, units: "si" }),
              }),
              " ",
              React.createElement(FormattedMessage, {
                id: "widget.weather.metric",
                defaultMessage: "Celsius (°C)",
              }),
            ),
            weatherSource !== "kma" &&
              React.createElement(
                "label",
                null,
                React.createElement("input", {
                  type: "radio",
                  checked: t.units === "us",
                  onChange: () => n({ ...t, units: "us" }),
                }),
                " ",
                React.createElement(FormattedMessage, {
                  id: "widget.weather.imperial",
                  defaultMessage: "Fahrenheit (°F)",
                }),
              ),
          ),
          React.createElement(WeatherDetailSettings, {
            data: t,
            setData: n,
            useAirKorea: weatherSource === "kma",
          }),
          React.createElement(
            "p",
            null,
            React.createElement(FormattedMessage, {
              ...(weatherSource === "kma"
                ? {
                    id: "widget.weather.kmaAirKoreaAttribution",
                    defaultMessage:
                      "Data by <kma>KMA</kma> · <airKorea>AirKorea</airKorea>",
                  }
                : {
                    id: "widget.weather.attribution",
                    defaultMessage:
                      "Data by <provider>Open-Meteo</provider> · <cams>CAMS</cams>",
                  }),
              values: {
                provider: (chunks: React.ReactNode[]) =>
                  React.createElement(
                    "a",
                    {
                      href: "https://open-meteo.com/",
                      rel: "noopener noreferrer",
                      target: "_blank",
                    },
                    chunks,
                  ),
                cams: (chunks: React.ReactNode[]) =>
                  React.createElement(
                    "a",
                    {
                      href: "https://atmosphere.copernicus.eu/",
                      rel: "noopener noreferrer",
                      target: "_blank",
                    },
                    chunks,
                  ),
                airKorea: (chunks: React.ReactNode[]) =>
                  React.createElement(
                    "a",
                    {
                      href: "https://www.airkorea.or.kr/",
                      rel: "noopener noreferrer",
                      target: "_blank",
                    },
                    chunks,
                  ),
                kma: (chunks: React.ReactNode[]) =>
                  React.createElement(
                    "a",
                    {
                      href: "https://www.weather.go.kr/",
                      rel: "noopener noreferrer",
                      target: "_blank",
                    },
                    chunks,
                  ),
              },
            }),
          ),
        )
      : null,
  );
}
