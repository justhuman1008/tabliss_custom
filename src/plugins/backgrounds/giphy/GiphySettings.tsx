import { FormattedMessage } from "react-intl";
import BackgroundApiKeySettings, { giphyKeyStorage } from "../BackgroundApiKey";
import React, { FC } from "react";

import { Props, defaultData } from "./types";
import { DebounceInput } from "../../shared";

const GiphySettings: FC<Props> = ({ data = defaultData, setData }) => (
  <div className="GiphySettings">
    <BackgroundApiKeySettings storageKey={giphyKeyStorage} />
    <label>
      <FormattedMessage id="background/giphy.tag" defaultMessage="Tag" />
      <DebounceInput
        type="text"
        value={data.tag}
        onChange={(value) => setData({ ...data, tag: value })}
        wait={500}
      />
    </label>
    <p className="info">
      <FormattedMessage
        id="background/giphy.tagHint"
        defaultMessage="Separate multiple tags with a comma"
      />
    </p>

    <label>
      <input
        type="checkbox"
        checked={data.expand}
        onChange={(event) => setData({ ...data, expand: !data.expand })}
      />{" "}
      <FormattedMessage
        id="background/giphy.expand"
        defaultMessage="Stretch to fill screen"
      />
    </label>

    <label>
      <input
        type="checkbox"
        checked={!data.nsfw}
        onChange={(event) => setData({ ...data, nsfw: !data.nsfw })}
      />{" "}
      <FormattedMessage
        id="background/giphy.safeSearch"
        defaultMessage="Safe Search"
      />
    </label>
  </div>
);

export default GiphySettings;
