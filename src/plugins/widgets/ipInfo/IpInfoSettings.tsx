import { FormattedMessage } from "react-intl";
import React from "react";
import { defaultData, Props } from "./types";

const IpInfoSettings: React.FC<Props> = ({ data = defaultData, setData }) => (
  <div className="IpInfoSettings">
    <label>
      <input
        type="checkbox"
        checked={data.displayCity}
        onChange={() => setData({ ...data, displayCity: !data.displayCity })}
      />
      <FormattedMessage id="widget.ipInfo.city" defaultMessage="Display City" />
    </label>

    <label>
      <input
        type="checkbox"
        checked={data.displayCountry}
        onChange={() =>
          setData({ ...data, displayCountry: !data.displayCountry })
        }
      />
      <FormattedMessage
        id="widget.ipInfo.country"
        defaultMessage="Display Country"
      />
    </label>
    <label>
      <FormattedMessage
        id="widget.ipInfo.interval"
        defaultMessage="Refresh interval (minutes)"
      />
      <input
        type="number"
        min={1}
        max={60}
        value={data.refreshInterval ?? defaultData.refreshInterval}
        onChange={(event) => {
          if (event.target.valueAsNumber >= 1)
            setData({ ...data, refreshInterval: event.target.valueAsNumber });
        }}
      />
    </label>
  </div>
);

export default IpInfoSettings;
