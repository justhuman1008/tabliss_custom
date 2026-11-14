import { FormattedMessage } from "react-intl";
import React, { FC } from "react";

import categories from "./categories";
import { Props, defaultData } from "./types";

const QuoteSettings: React.FC<Props> = ({ data = defaultData, setData }) => (
  <div className="QuoteSettings">
    <h5>
      <FormattedMessage id="widget.quote.daily" defaultMessage="Daily Quotes" />
    </h5>
    {categories.map((category) => (
      <label key={category.key}>
        <input
          type="radio"
          checked={data.category === category.key}
          onChange={() => setData({ category: category.key })}
        />{" "}
        <FormattedMessage
          id={"widget.quote.category." + category.key}
          defaultMessage={category.name}
        />
      </label>
    ))}
    <p>
      <FormattedMessage
        id="widget.quote.attribution"
        defaultMessage="Powered by"
      />{" "}
      <a
        href="https://theysaidso.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        They Said So
      </a>
    </p>
    <h5>
      <FormattedMessage
        id="widget.quote.hourly"
        defaultMessage="Hourly Quotes"
      />
    </h5>
    <label>
      <input
        type="radio"
        checked={data.category === "developerexcuses"}
        onChange={() => setData({ category: "developerexcuses" })}
      />{" "}
      <FormattedMessage
        id="widget.quote.developerExcuses"
        defaultMessage="Developer Excuses"
      />
    </label>
    <p>
      <FormattedMessage
        id="widget.quote.attribution"
        defaultMessage="Powered by"
      />{" "}
      <a
        href="https://www.developerexcuses.com/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Developer Excuses
      </a>
    </p>
  </div>
);

export default QuoteSettings;
