import { FormattedMessage } from "react-intl";
import React, { FC } from "react";
import { FallbackProps } from "react-error-boundary";

import { Icon } from "./icons";

const Crashed: FC<FallbackProps> = () => (
  <div className="Crashed">
    <Icon name="alert-triangle" />{" "}
    <FormattedMessage
      id="errors.plugin"
      defaultMessage="This widget could not be loaded."
    />
  </div>
);

export default Crashed;
