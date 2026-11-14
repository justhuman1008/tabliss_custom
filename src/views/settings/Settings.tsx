import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UiContext } from "../../contexts/ui";
import { exportStore, importStore, resetStore } from "../../db/action";
import { useKeyPress } from "../../hooks";
import { Icon } from "../shared";
import Logo from "../shared/Logo";
import Background from "./Background";
import Persist from "./Persist";
import "./Settings.sass";
import System from "./System";
import Widgets from "./Widgets";

const Settings: React.FC = () => {
  const { toggleSettings } = React.useContext(UiContext);

  const { formatMessage } = useIntl();
  const importError = () =>
    alert(
      formatMessage({
        id: "settings.import.failure",
        defaultMessage:
          "Could not import settings. Select a Tabliss backup file.",
      }),
    );

  const handleReset = () => {
    if (
      confirm(
        formatMessage({
          id: "settings.reset.confirm",
          defaultMessage:
            "Are you sure you want to delete all of your Tabliss settings? This cannot be undone.",
        }),
      )
    )
      resetStore();
  };

  const handleExport = () => {
    const json = exportStore();
    const url = URL.createObjectURL(
      new Blob([json], { type: "application/json" }),
    );

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "tabliss.json";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.style.display = "none";
    input.type = "file";
    input.accept = ".json,application/json";
    input.addEventListener("change", async () => {
      const file = input.files?.[0];
      input.remove();
      if (!file) return;
      try {
        importStore(JSON.parse(await file.text()));
      } catch {
        importError();
      }
    });
    input.addEventListener("cancel", () => input.remove());
    input.click();
  };

  useKeyPress(toggleSettings, ["Escape"]);

  return (
    <div className="Settings">
      <a onClick={toggleSettings} className="fullscreen" />

      <div className="plane">
        <Logo />

        <Background />

        <Widgets />

        <System />

        <div className="Widget" style={{ textAlign: "center" }}>
          <h4>
            <FormattedMessage
              id="settings.manage"
              defaultMessage="Manage Settings"
            />
          </h4>
          <p
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5em",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="button button--primary"
              onClick={handleImport}
            >
              <FormattedMessage id="settings.import" defaultMessage="Import" />
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={handleExport}
            >
              <FormattedMessage id="settings.export" defaultMessage="Export" />
            </button>
            <button
              type="button"
              className="button button--secondary"
              onClick={handleReset}
            >
              <FormattedMessage id="settings.reset" defaultMessage="Reset" />
            </button>
          </p>
          <hr />
          <Persist />
        </div>

        <div style={{ textAlign: "center" }} className="Widget">
          <h4>
            <FormattedMessage
              id="settings.links.original"
              defaultMessage="Original Links"
            />
          </h4>
          <p>
            <a href="https://tabliss.io/" target="_blank">
              <Icon name="globe" /> Website
            </a>
            &nbsp;&nbsp;
            <a
              href="https://twitter.com/tabliss"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="twitter" /> Twitter
            </a>
            &nbsp;&nbsp;
            <a
              href="https://github.com/joelshepherd/tabliss"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="github" /> GitHub
            </a>
          </p>
          <hr />
          <h4>
            <FormattedMessage
              id="settings.links.custom"
              defaultMessage="Custom Version Links"
            />
          </h4>
          <p>
            <a
              href="https://github.com/justhuman1008/tabliss_custom"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icon name="github" /> GitHub
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Settings);
