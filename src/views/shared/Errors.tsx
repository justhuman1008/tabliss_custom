import { FormattedMessage, useIntl } from "react-intl";
import React from "react";
import { ErrorContext } from "../../contexts/error";
import Modal from "./modal/Modal";

type Props = {
  onClose: () => void;
};

const Errors: React.FC<Props> = ({ onClose }) => {
  const { formatMessage } = useIntl();
  const { errors } = React.useContext(ErrorContext);
  return (
    <Modal onClose={onClose}>
      <div className="Settings">
        <a
          className="button button--primary"
          href="https://tabliss.io/support.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ float: "right", fontSize: "1.1em" }}
        >
          <FormattedMessage
            id="errors.support"
            defaultMessage="Visit support"
          />
        </a>
        <h2 style={{ margin: 0 }}>
          <FormattedMessage id="errors.title" defaultMessage="Errors" />
        </h2>
        {errors.map((error, index) => (
          <div key={index} className="Widget">
            {error.descriptor ? formatMessage(error.descriptor) : error.message}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Errors;
