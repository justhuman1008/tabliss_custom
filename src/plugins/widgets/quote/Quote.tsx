import { FormattedMessage } from "react-intl";
import React from "react";
import { useCachedEffect } from "../../../hooks";
import { HOURS } from "../../../utils";
import { getQuote } from "./api";
import "./Quote.sass";
import { defaultData, Props } from "./types";

const EXPIRE_IN = 1 * HOURS;

const Quote: React.FC<Props> = ({
  cache,
  data = defaultData,
  setCache,
  loader,
}) => {
  useCachedEffect(
    () => {
      getQuote(loader, data.category ?? "inspire")
        .then(setCache)
        .catch(() => {});
    },
    cache ? cache.timestamp + EXPIRE_IN : 0,
    [data.category],
  );

  if (!cache) {
    return null;
  }

  const text =
    cache.quote === "Too many requests this hour." ? (
      <FormattedMessage
        id="widget.quote.error.rateLimit"
        defaultMessage={cache.quote}
      />
    ) : cache.quote === "Unable to get a new developer excuse." ? (
      <FormattedMessage
        id="widget.quote.error.developerExcuses"
        defaultMessage={cache.quote}
      />
    ) : (
      cache.quote
    );
  if (!text) return null;
  return (
    <div className="Quote">
      <h4 className="QuoteContent">
        “{text}”
        {cache.author && (
          <sub>
            <br />
            &mdash; {cache.author}
          </sub>
        )}
      </h4>
    </div>
  );
};

export default Quote;
