import { FormattedMessage, useIntl } from "react-intl";
import React, { FC } from "react";

import { Props, defaultData } from "./types";

const MessageSettings: FC<Props> = ({ data, setData }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="MessageSettings">
      <label>
        <FormattedMessage id="widget.message.label" defaultMessage="Message" />
        <textarea
          rows={3}
          value={
            data?.messages[0] ??
            formatMessage({
              id: "widget.message.default",
              defaultMessage: defaultData.messages[0],
            })
          }
          onChange={(event) => setData({ messages: [event.target.value] })}
        />
      </label>
    </div>
  );
};

export default MessageSettings;
