import React from "react";
import { FormattedMessage } from "react-intl";
import { db } from "../../db/state";
import { useKey } from "../../lib/db/react";
import { normalizeLocale } from "../../locales";
import TimeZoneInput from "../shared/timeZone/TimeZoneInput";

const System: React.FC = () => {
  const [locale, setLocale] = useKey(db, "locale");
  const [timeZone, setTimeZone] = useKey(db, "timeZone");

  return (
    <div>
      <h2>
        <FormattedMessage
          id="settings"
          defaultMessage="Settings"
          description="Settings title"
        />
      </h2>

      <label
        style={{
          alignItems: "center",
          display: "grid",
          gridGap: "0 0.5rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          margin: 0,
        }}
      >
        <span>
          <FormattedMessage id="settings.language" defaultMessage="Language" />
        </span>
        <select
          value={normalizeLocale(locale)}
          onChange={(event) => setLocale(event.target.value)}
        >
          <option value="en" title="English (American)">
            English (US)
          </option>
          <option value="ko" title="Korean">
            한국어
          </option>
        </select>
      </label>

      <label
        style={{
          alignItems: "center",
          display: "grid",
          gridGap: "0 0.5rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          margin: 0,
        }}
      >
        <FormattedMessage id="settings.timeZone" defaultMessage="Time Zone" />
        <TimeZoneInput timeZone={timeZone} onChange={setTimeZone} />
      </label>
    </div>
  );
};

export default System;
