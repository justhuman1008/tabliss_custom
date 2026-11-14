import { FormattedMessage } from "react-intl";
import React, { FC } from "react";

import { Props, defaultData } from "./types";

const LiteratureClockSettings: FC<Props> = ({
  data = defaultData,
  setData,
}) => (
  <div className="LiteratureClockSettings">
    <label>
      <input
        type="checkbox"
        checked={data.showBookAndAuthor}
        onChange={() =>
          setData({ ...data, showBookAndAuthor: !data.showBookAndAuthor })
        }
      />{" "}
      <FormattedMessage
        id="widget.literatureClock.showSource"
        defaultMessage="Display book and author"
      />
    </label>

    <label>
      <input
        type="checkbox"
        checked={data.centerText}
        onChange={() => setData({ ...data, centerText: !data.centerText })}
      />{" "}
      <FormattedMessage
        id="widget.literatureClock.centerText"
        defaultMessage="Align text at center"
      />
    </label>
  </div>
);

export default LiteratureClockSettings;
