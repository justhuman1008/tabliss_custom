import React from "react";
import { FormattedMessage } from "react-intl";
import { Icon } from "../../../views/shared";
import { Image } from "./types";

export const UTM =
  "?utm_source=Start&utm_medium=referral&utm_campaign=api-credit";

interface Props {
  credit: Image["credit"];
  paused: boolean;
  onPause: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}

const UnsplashCredit: React.FC<Props> = ({
  credit,
  paused,
  onPause,
  onPrev,
  onNext,
}) => (
  <div className="credit">
    <div className="photo">
      <FormattedMessage
        id="plugins.unsplash.attribution"
        defaultMessage="<photo>Photo</photo>, <author>{name}</author>, <provider>Unsplash</provider>"
        values={{
          name: credit.userName,
          photo: (chunks) => (
            <a href={credit.imageLink + UTM} rel="noopener noreferrer">
              {chunks}
            </a>
          ),
          author: (chunks) => (
            <a href={credit.userLink + UTM} rel="noopener noreferrer">
              {chunks}
            </a>
          ),
          provider: (chunks) => (
            <a href={"https://unsplash.com/" + UTM} rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        }}
      />
    </div>

    <div className="controls">
      <a className={onPrev ? "" : "hidden"} onClick={onPrev ?? undefined}>
        <Icon name="arrow-left" />
      </a>{" "}
      <a onClick={onPause}>
        <Icon name={paused ? "play" : "pause"} />
      </a>{" "}
      <a className={onNext ? "" : "hidden"} onClick={onNext ?? undefined}>
        <Icon name="arrow-right" />
      </a>
    </div>

    <div className="location">{credit.location}</div>
  </div>
);

export default React.memo(UnsplashCredit);
