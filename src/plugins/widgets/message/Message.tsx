import { FormattedMessage } from "react-intl";
import React, { FC } from "react";

import { Props, defaultData } from "./types";

const Message: FC<Props> = ({ data }) => (
  <div className="Message">
    <h3 style={{ whiteSpace: "pre" }}>
      {data ? (
        data.messages[0]
      ) : (
        <FormattedMessage
          id="widget.message.default"
          defaultMessage={defaultData.messages[0]}
        />
      )}
    </h3>
  </div>
);

export default Message;
