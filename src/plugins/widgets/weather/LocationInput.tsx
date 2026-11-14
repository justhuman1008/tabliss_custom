import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Icon } from "../../../views/shared";
import {
  findKmaLocations,
  findOpenMeteoLocations,
  hasWeatherLocation,
  loadKmaLocations,
  roundCoordinate,
} from "./api";
import type { Coordinates, Location, WeatherSource } from "./types";
import "./LocationInput.sass";

type Props = Coordinates & {
  weatherSource: WeatherSource;
  onChange: (location: Location) => void;
};

function CitySearch({ onChange, weatherSource }: Props) {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [matches, setMatches] = useState<Location[]>([]);
  const { formatMessage, locale } = useIntl();
  const useKma = weatherSource === "kma";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = query.trim();
    if (!name || pending) return;
    setPending(true);
    setMatches([]);
    try {
      const results = useKma
        ? findKmaLocations(await loadKmaLocations(), name)
        : await findOpenMeteoLocations(name, locale);
      if (results.length === 1) onChange(results[0]);
      else if (results.length > 1) setMatches(results);
      else
        alert(
          formatMessage({
            id: "widget.weather.cityNotFound",
            defaultMessage: "Unable to find location. Please try again.",
          }),
        );
    } catch {
      alert(
        formatMessage({
          id: "widget.weather.searchError",
          defaultMessage: "City search is unavailable. Please try again later.",
        }),
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <div className="grid" style={{ gridTemplateColumns: "1fr auto" }}>
        <label htmlFor="LocationInput__query">
          <FormattedMessage
            id="widget.weather.citySearch"
            defaultMessage="Search for city"
          />
        </label>
        <div />
        <input
          id="LocationInput__query"
          type="text"
          value={query}
          disabled={pending}
          placeholder={formatMessage(
            useKma
              ? {
                  id: "widget.weather.kmaLocationPlaceholder",
                  defaultMessage: "Korean region name (e.g. 수영구)",
                }
              : {
                  id: "widget.weather.cityPlaceholder",
                  defaultMessage: "City or location",
                },
          )}
          onChange={(event) => {
            setQuery(event.target.value);
            setMatches([]);
          }}
        />
        <button
          type="submit"
          disabled={pending}
          className="button--primary button--icon"
          aria-label={formatMessage({
            id: "widget.weather.citySearch",
            defaultMessage: "Search for city",
          })}
        >
          <Icon name="search" />
        </button>
      </div>
      {matches.length > 1 && (
        <label>
          <FormattedMessage
            id="widget.weather.chooseLocation"
            defaultMessage="Choose a location"
          />
          <select
            value=""
            onChange={(event) => onChange(matches[Number(event.target.value)])}
          >
            <option value="" disabled>
              —
            </option>
            {matches.map((match, index) => (
              <option value={index} key={index}>
                {match.name}
              </option>
            ))}
          </select>
        </label>
      )}
    </form>
  );
}

const axes = [
  {
    key: "latitude",
    max: 90,
    id: "widget.weather.latitude",
    defaultMessage: "Latitude",
  },
  {
    key: "longitude",
    max: 180,
    id: "widget.weather.longitude",
    defaultMessage: "Longitude",
  },
] as const;

export default function LocationInput({ onChange, ...props }: Props) {
  const [search, setSearch] = useState(
    !hasWeatherLocation(props.latitude, props.longitude),
  );
  const { formatMessage } = useIntl();
  const geolocation = "geolocation" in navigator;

  function locate() {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        onChange({
          latitude: roundCoordinate(coords.latitude),
          longitude: roundCoordinate(coords.longitude),
        }),
      (error) =>
        alert(
          formatMessage(
            {
              id: "widget.weather.locationError",
              defaultMessage: "Cannot determine your location: {reason}",
            },
            { reason: error.message },
          ),
        ),
    );
  }

  return (
    <div className="LocationInput">
      {search ? (
        <CitySearch
          key={props.weatherSource}
          {...props}
          onChange={(location) => {
            onChange(location);
            setSearch(false);
          }}
        />
      ) : (
        <div
          className="grid"
          style={{
            gridTemplateColumns: geolocation ? "1fr 1fr auto" : "1fr 1fr",
          }}
        >
          {axes.map(({ key, id, defaultMessage }) => (
            <label key={key} htmlFor={"LocationInput__" + key}>
              <FormattedMessage id={id} defaultMessage={defaultMessage} />
            </label>
          ))}
          {geolocation && <div />}
          {axes.map(({ key, max }) => (
            <input
              id={"LocationInput__" + key}
              key={key + props[key]}
              type="text"
              inputMode="decimal"
              defaultValue={props[key]}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              onBlur={(event) => {
                const raw = event.currentTarget.value.trim();
                const value = raw ? Number(raw) : undefined;
                if (
                  value !== undefined &&
                  (!Number.isFinite(value) || Math.abs(value) > max)
                )
                  event.currentTarget.value = String(props[key] ?? "");
                else if (value !== props[key]) onChange({ [key]: value });
              }}
            />
          ))}
          {geolocation && (
            <button
              type="button"
              className="button--primary button--icon"
              onClick={locate}
              aria-label="Geolocation"
            >
              <Icon name="navigation" />
            </button>
          )}
        </div>
      )}
      <a onClick={() => setSearch(!search)}>
        {search ? (
          <FormattedMessage
            id="widget.weather.coordinates"
            defaultMessage="Enter coordinates"
          />
        ) : (
          <FormattedMessage
            id="widget.weather.citySearch"
            defaultMessage="Search for city"
          />
        )}
      </a>
    </div>
  );
}
