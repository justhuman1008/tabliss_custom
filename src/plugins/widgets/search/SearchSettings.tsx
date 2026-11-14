import { FormattedMessage, useIntl } from "react-intl";
import { messages } from "./Search";
import React, { FC } from "react";

import { engines } from "./engines";
import { Props, defaultData } from "./types";

const SearchSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const { formatMessage } = useIntl();
  const id = React.useId();
  function resetText() {
    const { placeholderText, ...settings } = data;
    setData(settings);
  }
  return (
    <div className="SearchSettings">
      <label>
        <FormattedMessage
          id="widget.search.engine"
          defaultMessage="Search Provider"
        />
        <select
          onChange={(event) =>
            setData({ ...data, searchEngine: event.target.value })
          }
          value={
            engines.some((engine) => engine.key === data.searchEngine)
              ? data.searchEngine
              : defaultData.searchEngine
          }
        >
          {engines.map(({ key, name }) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor={id}>
        <FormattedMessage
          id="widget.search.text"
          defaultMessage="Default text"
        />
        <input
          id={id}
          type="text"
          value={data.placeholderText ?? formatMessage(messages.placeholder)}
          onChange={(event) =>
            setData({ ...data, placeholderText: event.target.value })
          }
        />
      </label>
      <button
        type="button"
        className="button button--secondary"
        aria-controls={id}
        disabled={data.placeholderText == null}
        onClick={resetText}
      >
        <FormattedMessage id="settings.reset" defaultMessage="Reset" />
      </button>

      {BUILD_TARGET === "web" && (
        <label>
          Suggestions Provider
          <select
            onChange={(event) =>
              setData({ ...data, suggestionsEngine: event.target.value })
            }
            value={data.suggestionsEngine}
          >
            <option key="off" value="">
              Off
            </option>
            {engines
              .filter(({ suggest_url }) => Boolean(suggest_url))
              .map(({ key, name }) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
          </select>
        </label>
      )}

      {data.suggestionsEngine && (
        <label>
          <FormattedMessage
            id="widget.search.suggestions"
            defaultMessage="Number of suggestions"
          />
          <input
            type="number"
            min="1"
            max="10"
            value={data.suggestionsQuantity}
            onChange={(event) =>
              setData({
                ...data,
                suggestionsQuantity: Number(event.target.value),
              })
            }
          />
        </label>
      )}
    </div>
  );
};

export default SearchSettings;
