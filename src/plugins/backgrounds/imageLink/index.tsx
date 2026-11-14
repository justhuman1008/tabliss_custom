import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { getRemoteImageUrl } from "../../../remoteImageUrl";
import Backdrop from "../../../views/shared/Backdrop";
import { API, Config } from "../../types";

type Props = API<{ url: string }>;

function RemoteImage({ url }: { url: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Backdrop className="fullscreen" ready={loaded}>
      <img
        className="fullscreen"
        src={url}
        alt=""
        referrerPolicy="no-referrer"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          visibility: loaded ? "visible" : "hidden",
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </Backdrop>
  );
}

function ImageLink({ data }: Props) {
  const url = getRemoteImageUrl(data?.url);
  return (
    <div className="Image default fullscreen">
      {url && <RemoteImage key={url} url={url} />}
    </div>
  );
}

function ImageLinkSettings({ data, setData }: Props) {
  return (
    <label>
      <FormattedMessage
        id="background/image-link.address"
        defaultMessage="Image URL"
      />
      <input
        id="ImageLinkUrl"
        type="url"
        value={data?.url ?? ""}
        onChange={(event) => setData({ url: event.target.value })}
      />
    </label>
  );
}

const config: Config = {
  key: "background/image-link",
  name: "Image Link",
  description: "Use an image from a URL.",
  dashboardComponent: ImageLink,
  settingsComponent: ImageLinkSettings,
  supportsBackdrop: true,
};

export default config;
