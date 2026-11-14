import React, { FC, useMemo } from "react";
import { defineMessages, useIntl } from "react-intl";

import { getRemoteImageUrl } from "../../../remoteImageUrl";
import { Icon } from "../../../views/shared";
import { Link } from "./types";

const getDomain = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (e) {
    return null;
  }
};

const messages = defineMessages({
  shortcutHint: {
    id: "plugins.links.shortcutHint",
    description: "Hover hint text for links with a keyboard shortcut",
    defaultMessage: "Press {number} or click to visit",
  },
  standardHint: {
    id: "plugins.links.standardHint",
    description: "Hover hint text for links without a keyboard shortcut",
    defaultMessage: "Click to visit",
  },
});

type Props = Link & { number: number; linkOpenStyle: boolean };

const Display: FC<Props> = ({
  icon,
  name,
  number,
  url,
  linkOpenStyle,
  iconImageUrl,
}) => {
  const intl = useIntl();

  const title = useMemo(
    () =>
      number < 10
        ? intl.formatMessage(messages.shortcutHint, { number })
        : intl.formatMessage(messages.standardHint),
    [intl, number],
  );

  const domain = useMemo(() => getDomain(url), [url]);

  if (!icon) return null;
  if (icon === "_image") {
    const imageUrl = getRemoteImageUrl(iconImageUrl);
    return imageUrl ? (
      <QuickLinkImage
        key={imageUrl}
        imageUrl={imageUrl}
        imageAlt={name ? "" : domain ?? url}
        name={name}
        url={url}
        target={linkOpenStyle ? "_blank" : "_self"}
        title={title}
      />
    ) : null;
  }

  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target={linkOpenStyle ? "_blank" : "_self"}
      title={title}
    >
      {icon === "_favicon" ? (
        domain ? (
          <i>
            <img
              alt={domain}
              src={
                "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,URL&url=https://" +
                encodeURIComponent(domain) +
                "&size=32"
              }
            />
          </i>
        ) : null
      ) : icon ? (
        <Icon name={icon} />
      ) : null}
      {icon && name && " "}
      <span className="LinkText">{name}</span>
    </a>
  );
};

function QuickLinkImage({
  imageUrl,
  imageAlt,
  name,
  url,
  target,
  title,
}: {
  imageUrl: string;
  imageAlt: string;
  name?: string;
  url: string;
  target: string;
  title: string;
}) {
  const [status, setStatus] = React.useState<"loading" | "ready" | "failed">(
    "loading",
  );
  if (status === "failed") return null;
  return (
    <a
      href={url}
      rel="noopener noreferrer"
      target={target}
      title={title}
      hidden={status === "loading"}
    >
      <i>
        <img
          src={imageUrl}
          alt={imageAlt}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("failed")}
          referrerPolicy="no-referrer"
        />
      </i>
      {name && (
        <>
          {" "}
          <span className="LinkText">{name}</span>
        </>
      )}
    </a>
  );
}

export default Display;
