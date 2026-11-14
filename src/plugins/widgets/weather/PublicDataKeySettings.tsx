import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  publicDataKey,
  publicDataOrigin,
  usePublicDataKey,
  usePublicDataPermission,
} from "./useAirQuality";
export default function PublicDataKeySettings() {
  const key = usePublicDataKey(true);
  const publicDataAllowed = usePublicDataPermission(true);
  const [draft, setDraft] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const { formatMessage } = useIntl();

  async function saveKey() {
    const value = draft.trim();
    if (!value || pending) return;
    setStatus("");
    let normalized;
    try {
      normalized = value.includes("%") ? decodeURIComponent(value) : value;
    } catch {
      setStatus("invalid");
      return;
    }
    if (/\s/.test(normalized)) {
      setStatus("invalid");
      return;
    }
    setPending(true);
    // Edge requires the permission request to start within the click handler.
    const access =
      publicDataAllowed === true
        ? Promise.resolve("")
        : requestPublicDataAccess();
    let saved = false;
    try {
      await browser.storage.local.set({ [publicDataKey]: normalized });
      setDraft("");
      saved = true;
    } catch {
      setStatus("storage");
    }
    const accessStatus = await access;
    if (saved) setStatus(accessStatus);
    setPending(false);
  }

  async function removeKey() {
    setPending(true);
    setStatus("");
    try {
      await browser.storage.local.remove(publicDataKey);
      setDraft("");
    } catch {
      setStatus("storage");
    } finally {
      setPending(false);
    }
  }

  async function requestPublicDataAccess() {
    try {
      await browser.permissions.request({ origins: [publicDataOrigin] });
      return "";
    } catch {
      return "permissionError";
    }
  }

  async function retryPublicDataAccess() {
    setPending(true);
    setStatus("");
    setStatus(await requestPublicDataAccess());
    setPending(false);
  }

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "label",
      null,
      React.createElement(FormattedMessage, {
        id: "widget.weather.airQuality.key",
        defaultMessage: "Public Data Portal API key",
      }),
      React.createElement("input", {
        type: "password",
        autoComplete: "off",
        value: draft,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setDraft(event.target.value),
        style: {
          display: "block",
          width: "100%",
          margin: "0.5em 0",
          padding: "0.5em",
          border: "1px solid #bdc3c7",
          borderRadius: "0.2em",
          color: "inherit",
        },
        placeholder: key
          ? formatMessage({
              id: "widget.weather.airQuality.keySaved",
              defaultMessage: "API key saved",
            })
          : undefined,
      }),
    ),
    React.createElement(
      "button",
      {
        type: "button",
        className: "button button--primary",
        disabled: !draft.trim() || pending,
        onClick: saveKey,
      },
      React.createElement(FormattedMessage, {
        id: "widget.weather.airQuality.saveKey",
        defaultMessage: "Save API key",
      }),
    ),
    " ",
    key &&
      React.createElement(
        "button",
        {
          type: "button",
          className: "button button--secondary",
          disabled: pending,
          onClick: removeKey,
        },
        React.createElement(FormattedMessage, {
          id: "widget.weather.airQuality.removeKey",
          defaultMessage: "Delete API key",
        }),
      ),
    key &&
      publicDataAllowed === false &&
      React.createElement(
        "div",
        null,
        React.createElement(
          "button",
          {
            type: "button",
            className: "button button--secondary",
            disabled: pending,
            onClick: retryPublicDataAccess,
          },
          React.createElement(FormattedMessage, {
            id: "widget.weather.airQuality.allowAccess",
            defaultMessage: "Allow access",
          }),
        ),
      ),
    React.createElement(
      "div",
      null,
      React.createElement(
        "small",
        null,
        React.createElement(FormattedMessage, {
          id: "widget.weather.airQuality.keyLocal",
          defaultMessage: "The key is stored only in this browser.",
        }),
      ),
    ),
    key &&
      publicDataAllowed === false &&
      status === "" &&
      React.createElement(
        "div",
        { role: "status" },
        React.createElement(FormattedMessage, {
          id: "widget.weather.airQuality.permission",
          defaultMessage:
            "Allow access to the Public Data Portal in Weather settings.",
        }),
      ),
    status === "permissionError" &&
      React.createElement(
        "div",
        { role: "status" },
        React.createElement(FormattedMessage, {
          id: "widget.weather.airQuality.permissionError",
          defaultMessage:
            "Could not request access to the Public Data Portal. Reload Tabliss in the browser’s extensions page and try again.",
        }),
      ),
    status === "invalid" &&
      React.createElement(
        "div",
        { role: "status" },
        React.createElement(FormattedMessage, {
          id: "widget.weather.airQuality.invalidKey",
          defaultMessage: "Check the API key format and paste it again.",
        }),
      ),
    status === "storage" &&
      React.createElement(
        "div",
        { role: "status" },
        React.createElement(FormattedMessage, {
          id: "widget.weather.airQuality.storageError",
          defaultMessage: "Could not save or delete the API key.",
        }),
      ),
  );
}
