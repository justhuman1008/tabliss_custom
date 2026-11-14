import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useAirQuality } from "./useAirQuality";
import type { Fields } from "./types";
const particulateGrades = [
  { id: "widget.weather.airQuality.good", defaultMessage: "Good" },
  { id: "widget.weather.airQuality.moderate", defaultMessage: "Moderate" },
  { id: "widget.weather.airQuality.bad", defaultMessage: "Bad" },
  { id: "widget.weather.airQuality.veryBad", defaultMessage: "Very bad" },
];
const particulateLimits = { pm10: [30, 80, 150], pm25: [15, 35, 75] };

export default function AirQualityDetails({
  sample,
  station,
  status,
  fields,
}: ReturnType<typeof useAirQuality> & { fields: Fields }) {
  const { formatNumber, formatMessage, formatDate } = useIntl();
  const stationName = fields.station && station;
  const measurementTime =
    fields.measurementTime &&
    sample &&
    formatDate(sample.timestamp, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Seoul",
    });
  function concentration(pollutant: keyof typeof particulateLimits) {
    const value = sample?.[pollutant];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0)
      return "—";

    const displayed = Math.round(value * 10) / 10;
    const index = particulateLimits[pollutant].findIndex(
      (limit) => displayed <= limit,
    );
    const grade = formatMessage(
      index === -1 ? particulateGrades[3] : particulateGrades[index],
    );
    return React.createElement(
      React.Fragment,
      null,
      grade,
      React.createElement(
        "small",
        { style: { fontSize: "0.8em" } },
        `(${formatNumber(displayed, { maximumFractionDigits: 1 })} µg/m³)`,
      ),
    );
  }
  return React.createElement(
    React.Fragment,
    null,
    fields.pm10 &&
      React.createElement(
        "dl",
        null,
        React.createElement("dt", null, concentration("pm10")),
        React.createElement(
          "dd",
          null,
          React.createElement(FormattedMessage, {
            id: "widget.weather.pm10",
            defaultMessage: "Particulate matter (PM10)",
          }),
        ),
      ),
    fields.pm25 &&
      React.createElement(
        "dl",
        null,
        React.createElement("dt", null, concentration("pm25")),
        React.createElement(
          "dd",
          null,
          React.createElement(FormattedMessage, {
            id: "widget.weather.pm25",
            defaultMessage: "Fine particulate matter (PM2.5)",
          }),
        ),
      ),
    status === "setup"
      ? React.createElement(
          "small",
          null,
          React.createElement(FormattedMessage, {
            id: "widget.weather.airQuality.setup",
            defaultMessage:
              "Save a Public Data Portal API key in Weather settings.",
          }),
        )
      : status === "location"
        ? React.createElement(
            "small",
            null,
            React.createElement(FormattedMessage, {
              id: "widget.weather.airQuality.location",
              defaultMessage:
                "Set a weather location to find the nearest AirKorea station.",
            }),
          )
        : status === "permission"
          ? React.createElement(
              "small",
              null,
              React.createElement(FormattedMessage, {
                id: "widget.weather.airQuality.permission",
                defaultMessage:
                  "Allow access to the Public Data Portal in Weather settings.",
              }),
            )
          : status === "stationError"
            ? React.createElement(
                "small",
                null,
                React.createElement(FormattedMessage, {
                  id: "widget.weather.airQuality.stationError",
                  defaultMessage:
                    "Could not load the AirKorea station list. Check access to the AirKorea Station Information API.",
                }),
              )
            : status === "error"
              ? React.createElement(
                  "small",
                  null,
                  React.createElement(FormattedMessage, {
                    id: "widget.weather.airQuality.readError",
                    defaultMessage:
                      "Could not load AirKorea readings. Check access to the AirKorea Air Pollution Information API.",
                  }),
                )
              : null,
    stationName || measurementTime
      ? React.createElement(
          "small",
          null,
          stationName &&
            React.createElement(FormattedMessage, {
              id: "widget.weather.airQuality.selectedStation",
              defaultMessage: "Station {station}",
              values: { station: stationName },
            }),
          stationName && measurementTime && " ",
          measurementTime,
        )
      : null,
  );
}
