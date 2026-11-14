import { FormattedMessage, useIntl } from "react-intl";
import BackgroundApiKeySettings, {
  unsplashKeyStorage,
} from "../BackgroundApiKey";
import React from "react";
import { Icon } from "../../../views/shared";
import { DebounceInput } from "../../shared";
import topics from "./topics.json";
import { defaultData, Props } from "./types";

const UnsplashSettings: React.FC<Props> = ({ data = defaultData, setData }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="UnsplashSettings">
      <BackgroundApiKeySettings storageKey={unsplashKeyStorage} unsplash />
      <label>
        <span style={{ float: "right" }}>
          {data.paused ? (
            <span className="text--grey">
              <FormattedMessage
                id="background/unsplash.paused"
                defaultMessage="(Paused) "
              />
            </span>
          ) : null}
          <a onClick={() => setData({ ...data, paused: !data.paused })}>
            <Icon name={data.paused ? "play" : "pause"} />
          </a>
        </span>
        <FormattedMessage
          id="background/unsplash.interval"
          defaultMessage="Show a new photo"
        />
        <select
          value={data.timeout}
          onChange={(event) =>
            setData({ ...data, timeout: Number(event.target.value) })
          }
        >
          <option value="0">
            <FormattedMessage
              id="background/unsplash.everyNewTab"
              defaultMessage="Every new tab"
            />
          </option>
          <option value="300">
            <FormattedMessage
              id="background/unsplash.every5Minutes"
              defaultMessage="Every 5 minutes"
            />
          </option>
          <option value="900">
            <FormattedMessage
              id="background/unsplash.every15Minutes"
              defaultMessage="Every 15 minutes"
            />
          </option>
          <option value="3600">
            <FormattedMessage
              id="background/unsplash.everyHour"
              defaultMessage="Every hour"
            />
          </option>
          <option value="86400">
            <FormattedMessage
              id="background/unsplash.everyDay"
              defaultMessage="Every day"
            />
          </option>
          <option value="604800">
            <FormattedMessage
              id="background/unsplash.everyWeek"
              defaultMessage="Every week"
            />
          </option>
        </select>
      </label>

      <label>
        <input
          type="radio"
          checked={data.by === "official"}
          onChange={() => setData({ ...data, by: "official" })}
        />{" "}
        <FormattedMessage
          id="background/unsplash.official"
          defaultMessage="Official Collection"
        />
      </label>

      <label>
        <input
          type="radio"
          checked={data.by === "topics"}
          onChange={() => setData({ ...data, by: "topics" })}
        />{" "}
        <FormattedMessage
          id="background/unsplash.topic"
          defaultMessage="Topic"
        />
      </label>

      <label>
        <input
          type="radio"
          checked={data.by === "search"}
          onChange={() => setData({ ...data, by: "search" })}
        />{" "}
        <FormattedMessage
          id="background/unsplash.search"
          defaultMessage="Search"
        />
      </label>

      <label>
        <input
          type="radio"
          checked={data.by === "collections"}
          onChange={() => setData({ ...data, by: "collections" })}
        />{" "}
        <FormattedMessage
          id="background/unsplash.collection"
          defaultMessage="Collection"
        />
      </label>

      {data.by === "topics" && (
        <label>
          <FormattedMessage
            id="background/unsplash.topic"
            defaultMessage="Topic"
          />
          <select
            value={data.topics}
            onChange={(event) =>
              setData({ ...data, topics: event.target.value })
            }
          >
            {topics.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {formatMessage({
                  id: "background/unsplash.topic." + topic.id,
                  defaultMessage: topic.title,
                })}
              </option>
            ))}
          </select>
        </label>
      )}

      {data.by === "search" && (
        <>
          <label>
            <FormattedMessage
              id="background/unsplash.tags"
              defaultMessage="Tags"
            />
            <DebounceInput
              type="text"
              value={data.search}
              placeholder={formatMessage({
                id: "background/unsplash.tagsPlaceholder",
                defaultMessage: "Try landscapes or animals...",
              })}
              onChange={(value) => setData({ ...data, search: value })}
              wait={500}
            />
          </label>

          <label>
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(event) =>
                setData({ ...data, featured: !data.featured })
              }
            />{" "}
            <FormattedMessage
              id="background/unsplash.featured"
              defaultMessage="Only featured images"
            />
          </label>
        </>
      )}

      {data.by === "collections" && (
        <label>
          <FormattedMessage
            id="background/unsplash.collection"
            defaultMessage="Collection"
          />
          <DebounceInput
            type="text"
            value={data.collections}
            placeholder={formatMessage({
              id: "background/unsplash.collectionPlaceholder",
              defaultMessage: "Collection ID number",
            })}
            onChange={(value) => setData({ ...data, collections: value })}
            wait={500}
          />
        </label>
      )}
    </div>
  );
};

export default UnsplashSettings;
