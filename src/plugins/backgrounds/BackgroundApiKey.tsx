import React from "react";
import { useIntl } from "react-intl";
import { DB } from "../../lib";
import { useValue } from "../../lib/db/react";
import {
  useLocalCredential,
  writeLocalCredential,
} from "../../hooks/useLocalCredential";

export const unsplashKeyStorage = "tabliss.unsplashAccessKey";
export const giphyKeyStorage = "tabliss.giphyApiKey";
const backgroundApiErrors = DB.init<Record<string, string | undefined>>();
export type Credential = { value: string; revision: string };

export default function BackgroundApiKeySettings({
  storageKey,
  unsplash = false,
}: {
  storageKey: string;
  unsplash?: boolean;
}) {
  const credential = useLocalCredential<Credential>(storageKey);
  const requestError = useValue(backgroundApiErrors, storageKey);
  const { formatMessage } = useIntl();
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");
  const message = (name: string, defaultMessage: string) =>
    formatMessage({ id: "background.apiKey." + name, defaultMessage });

  async function updateKey(remove: boolean) {
    const value = draft.trim();
    if (pending || (!remove && !value)) return;
    if (!remove && !/^[!-~]+$/.test(value)) {
      setError(message("invalid", "Check the API key format."));
      return;
    }
    setPending(true);
    setError("");
    try {
      await writeLocalCredential(
        storageKey,
        remove ? undefined : { value, revision: crypto.randomUUID() },
      );
      setDraft("");
    } catch {
      setError(
        message("storageError", "Could not save or delete the API key."),
      );
    } finally {
      setPending(false);
    }
  }

  return React.createElement(
    "div",
    { className: "BackgroundApiKeySettings" },
    React.createElement(
      "label",
      null,
      unsplash
        ? message("accessKey", "Access Key")
        : message("label", "API key"),
      React.createElement("input", {
        type: "password",
        autoComplete: "off",
        spellCheck: false,
        value: draft,
        placeholder: credential ? message("saved", "API key saved") : undefined,
        style: {
          display: "block",
          width: "100%",
          margin: "0.5em 0",
          padding: "0.5em",
          border: "1px solid #bdc3c7",
          borderRadius: "0.2em",
          color: "inherit",
        },
        onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
          setDraft(event.target.value),
      }),
    ),
    React.createElement(
      "button",
      {
        type: "button",
        className: "button button--primary",
        disabled: pending || !draft.trim(),
        onClick: () => updateKey(false),
      },
      message("save", "Save API key"),
    ),
    " ",
    credential &&
      React.createElement(
        "button",
        {
          type: "button",
          className: "button button--secondary",
          disabled: pending,
          onClick: () => updateKey(true),
        },
        message("remove", "Delete API key"),
      ),
    React.createElement(
      "p",
      { className: "info" },
      message("local", "The key is stored only in this browser."),
    ),
    (error || (credential && requestError)) &&
      React.createElement(
        "p",
        { role: "status" },
        error ||
          (requestError === "denied"
            ? message("denied", "The service rejected the API key.")
            : message(
                "loadError",
                "Could not load the background. Check the API key and try again.",
              )),
      ),
  );
}

export function clearBackgroundError(storageKey: string) {
  DB.del(backgroundApiErrors, storageKey);
}

export function backgroundApiFailure(storageKey: string, error: unknown) {
  const status = (error as { status?: number } | null)?.status;
  DB.put(
    backgroundApiErrors,
    storageKey,
    status === 401 || status === 403 ? "denied" : "load",
  );
}
