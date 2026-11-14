import React from "react";
import { FormattedMessage } from "react-intl";

const Persist: React.FC = () => {
  const [status, setStatus] = React.useState("checking");

  React.useEffect(() => {
    let active = true;
    async function check() {
      try {
        const granted =
          BUILD_TARGET !== "web" &&
          (await browser.permissions.contains({
            permissions: ["unlimitedStorage"],
          }));
        if (granted || (await navigator.storage.persisted())) {
          if (active) setStatus("enabled");
          return;
        }
      } catch {}
      if (active) setStatus("ready");
    }
    void check();
    return () => {
      active = false;
    };
  }, []);

  async function enable() {
    setStatus("pending");
    try {
      setStatus((await navigator.storage.persist()) ? "enabled" : "failure");
    } catch {
      setStatus("failure");
    }
  }

  return (
    <>
      <h4>
        <FormattedMessage
          id="settings.persist"
          defaultMessage="Persist Settings"
        />
      </h4>
      {status === "enabled" ? (
        <p role="status">
          <FormattedMessage
            id="settings.persist.enabled"
            defaultMessage="Storage protection is on."
          />
        </p>
      ) : (
        <>
          <p>
            <FormattedMessage
              id="settings.persist.description"
              defaultMessage="Ask your browser to protect Tabliss data from automatic deletion when storage is low."
            />
          </p>
          {status === "failure" && (
            <p role="status">
              <FormattedMessage
                id="settings.persist.failure"
                defaultMessage="Could not enable storage protection. You can try again."
              />
            </p>
          )}
          <button
            type="button"
            className="button button--primary"
            disabled={status === "checking" || status === "pending"}
            onClick={enable}
          >
            <FormattedMessage
              id="settings.persist"
              defaultMessage="Persist Settings"
            />
          </button>
        </>
      )}
    </>
  );
};

export default Persist;
