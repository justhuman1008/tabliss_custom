import React from "react";
import { FormattedMessage } from "react-intl";
import { useToggle } from "../../hooks";

type Props = {
  children: React.ReactNode;
  name: string;
  messageId?: string;
};

const ToggleSection: React.FC<Props> = ({ name, children, messageId }) => {
  const [isOpen, toggleOpen] = useToggle();

  return (
    <>
      <p>
        <a onClick={toggleOpen}>
          {messageId ? (
            <FormattedMessage
              id={messageId + (isOpen ? ".close" : ".open")}
              defaultMessage={(isOpen ? "Close " : "Open ") + name}
            />
          ) : (
            (isOpen ? "Close " : "Open ") + name
          )}
        </a>
      </p>

      {isOpen && children}
    </>
  );
};

export default ToggleSection;
