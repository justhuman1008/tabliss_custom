import { FormattedMessage } from "react-intl";
import React from "react";
import Modal from "./modal/Modal";

type Props = {
  onClose: () => void;
};

const StoreError: React.FC<Props> = ({ onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className="Settings">
        <h2 style={{ margin: 0 }}>
          <FormattedMessage
            id="errors.storage.title"
            defaultMessage="Storage Error"
          />
        </h2>
        <p style={{ fontSize: "1.25em" }}>
          <FormattedMessage
            id="errors.storage.explanation"
            defaultMessage="Tabliss is unable to load or save settings. This can happen in private browsing, when disk space is low, or when the browser profile is damaged."
          />
        </p>
        <p>
          <FormattedMessage
            id="errors.storage.retry"
            defaultMessage="If you have saved Tabliss settings, try restarting your browser and checking if your settings return."
          />
        </p>
        <p>
          <FormattedMessage
            id="errors.storage.help"
            defaultMessage="See the <guide>support guide</guide> or contact <email>support@tabliss.io</email> if the problem continues."
            values={{
              guide: (chunks) => (
                <a href="https://tabliss.io/support.html">{chunks}</a>
              ),
              email: (chunks) => (
                <a href="mailto:support@tabliss.io">{chunks}</a>
              ),
            }}
          />
        </p>
        <div className="Modal-footer">
          <a
            className="button button--primary"
            href="https://tabliss.io/support.html"
            style={{ fontSize: "1.1em" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage
              id="errors.storage.guide"
              defaultMessage="View Support Guide"
            />
          </a>
        </div>
      </div>
    </Modal>
  );
};

export default StoreError;
