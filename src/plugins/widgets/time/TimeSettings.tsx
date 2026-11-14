import { FormattedMessage, useIntl } from "react-intl";
import React, { FC } from "react";

import { Props, defaultData } from "./types";
import TimeZoneInput from "../../../views/shared/timeZone/TimeZoneInput";

const TimeSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="TimeSettings">
      <label>
        <FormattedMessage id="widget.display.name" defaultMessage="Name" />
        <input
          type="text"
          value={data.name}
          placeholder={formatMessage({
            id: "widget.time.optionalName",
            defaultMessage: "Optional name",
          })}
          onChange={(event) => setData({ ...data, name: event.target.value })}
        />
      </label>

      <label>
        <FormattedMessage id="settings.timeZone" defaultMessage="Time Zone" />
        <TimeZoneInput
          timeZone={data.timeZone}
          onChange={(timeZone) => setData({ ...data, timeZone })}
        />
      </label>

      <label>
        <input
          type="radio"
          checked={data.mode === "analogue"}
          onChange={() => setData({ ...data, mode: "analogue" })}
        />{" "}
        <FormattedMessage id="widget.time.analogue" defaultMessage="Analogue" />
      </label>

      <label>
        <input
          type="radio"
          checked={data.mode === "digital" && data.hour12}
          onChange={() => setData({ ...data, mode: "digital", hour12: true })}
        />{" "}
        <FormattedMessage
          id="widget.time.digital12"
          defaultMessage="12-hour digital"
        />
      </label>

      <label>
        <input
          type="radio"
          checked={data.mode === "digital" && !data.hour12}
          onChange={() => setData({ ...data, mode: "digital", hour12: false })}
        />{" "}
        <FormattedMessage
          id="widget.time.digital24"
          defaultMessage="24-hour digital"
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.showSeconds}
          onChange={() => setData({ ...data, showSeconds: !data.showSeconds })}
        />{" "}
        <FormattedMessage
          id="widget.time.showSeconds"
          defaultMessage="Display seconds"
        />
      </label>

      <label>
        <input
          type="checkbox"
          checked={data.showMinutes}
          onChange={() => setData({ ...data, showMinutes: !data.showMinutes })}
        />{" "}
        <FormattedMessage
          id="widget.time.showMinutes"
          defaultMessage="Display minutes"
        />
      </label>

      {data.mode === "digital" && data.hour12 && (
        <label>
          <input
            type="checkbox"
            checked={data.showDayPeriod}
            onChange={() =>
              setData({ ...data, showDayPeriod: !data.showDayPeriod })
            }
          />{" "}
          <FormattedMessage
            id="widget.time.showDayPeriod"
            defaultMessage="Display day period"
          />
        </label>
      )}

      <label>
        <input
          type="checkbox"
          checked={data.showDate}
          onChange={() => setData({ ...data, showDate: !data.showDate })}
        />{" "}
        <FormattedMessage
          id="widget.time.showDate"
          defaultMessage="Display date"
        />
      </label>
    </div>
  );
};

export default TimeSettings;
