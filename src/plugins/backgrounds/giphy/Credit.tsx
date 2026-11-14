import { FormattedMessage, useIntl } from "react-intl";
import React from "react";
import giphyLogo from "./giphy-logo.png";

type Props = {
  link?: string;
};

const Credit: React.FC<Props> = ({ link }) => {
  const { locale } = useIntl();
  return (
    <div className="credit">
      {locale === "ko" && (
        <>
          <FormattedMessage
            id="plugins.giphy.attribution"
            defaultMessage="Provided by"
          />{" "}
        </>
      )}
      <a
        href={link || "https://giphy.com/"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={giphyLogo} alt="GIPHY" />
      </a>
    </div>
  );
};

export default Credit;
