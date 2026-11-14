import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { MINUTES } from "../../../utils";
import categories from "./categories";
import {
  defaultData,
  JokeAPICategory,
  Props,
  selectedJokeCategories,
} from "./types";

const intervals = [
  [5, "Every 5 minutes"],
  [15, "Every 15 minutes"],
  [60, "Every hour"],
  [1440, "Every day"],
  [10080, "Every week"],
] as const;

export default function JokeSettings({ data = defaultData, setData }: Props) {
  const { formatMessage } = useIntl();
  const selected = selectedJokeCategories(data);
  function changeCategory(category: JokeAPICategory, checked: boolean) {
    const next =
      category === "any" && checked
        ? ["any" as const]
        : checked
          ? [...selected.filter((value) => value !== "any"), category]
          : selected.filter((value) => value !== category);
    setData({ ...data, categories: next.length ? next : ["any"] });
  }
  return (
    <div className="JokeSettings">
      <label>
        <FormattedMessage
          id="widget.joke.interval"
          defaultMessage="Show a new joke"
        />
        <select
          value={data.timeout ?? defaultData.timeout}
          onChange={(event) =>
            setData({ ...data, timeout: Number(event.target.value) })
          }
        >
          {intervals.map(([minutes, label]) => (
            <option key={minutes} value={minutes * MINUTES}>
              {formatMessage({
                id: "widget.joke.interval." + minutes,
                defaultMessage: label,
              })}
            </option>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>
          <FormattedMessage
            id="widget.joke.category"
            defaultMessage="Category"
          />
        </legend>
        {categories.map(({ key, name }) => (
          <label key={key}>
            <input
              type="checkbox"
              checked={selected.includes(key)}
              onChange={(event) => changeCategory(key, event.target.checked)}
            />{" "}
            <FormattedMessage
              id={"widget.joke.category." + key}
              defaultMessage={name}
            />
          </label>
        ))}
      </fieldset>
      <p>
        <FormattedMessage
          id="widget.joke.attribution"
          defaultMessage="Powered by"
        />{" "}
        <a
          href="https://jokeapi.dev/"
          target="_blank"
          rel="noopener noreferrer"
        >
          JokeAPI
        </a>
      </p>
    </div>
  );
}
