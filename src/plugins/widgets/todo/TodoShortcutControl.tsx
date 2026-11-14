import React from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";

export function formatTodoShortcut(
  shortcut: string,
  formatMessage: IntlShape["formatMessage"],
) {
  return shortcut === " "
    ? formatMessage({ id: "widget.todo.spaceKey", defaultMessage: "Space" })
    : shortcut.toUpperCase();
}

export default function TodoShortcutControl({
  shortcut,
  onChange,
}: {
  shortcut: string;
  onChange: (value: string) => void;
}) {
  const [recording, setRecording] = React.useState(false);
  const id = React.useId();
  const input = React.useRef<HTMLInputElement>(null);
  const changeButton = React.useRef<HTMLButtonElement>(null);
  const { formatMessage } = useIntl();

  function startRecording() {
    input.current?.focus();
    setRecording(true);
  }

  function finishRecording() {
    setRecording(false);
    changeButton.current?.focus();
  }

  function recordKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!recording || event.key === "Tab" || event.nativeEvent.isComposing)
      return;
    event.preventDefault();
    if (event.key === "Escape") {
      finishRecording();
      return;
    }
    if (
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      [...event.key].length !== 1
    )
      return;
    onChange(event.key);
    finishRecording();
  }

  return React.createElement(
    "div",
    { onKeyDown: (event: React.KeyboardEvent) => event.stopPropagation() },
    React.createElement(
      "label",
      { htmlFor: id },
      React.createElement(FormattedMessage, {
        id: "widget.todo.keybind",
        defaultMessage: "New task keybind",
      }),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: "0.5em" } },
      React.createElement("input", {
        id,
        ref: input,
        type: "text",
        readOnly: true,
        style: { minWidth: 0 },
        value: recording ? "" : formatTodoShortcut(shortcut, formatMessage),
        placeholder: recording
          ? formatMessage({
              id: "widget.todo.recording",
              defaultMessage: "Press a key",
            })
          : undefined,
        onBlur: () => setRecording(false),
        onKeyDown: recordKey,
      }),
      React.createElement(
        "button",
        {
          ref: changeButton,
          type: "button",
          className: "button button--primary",
          style: { flexShrink: 0 },
          "aria-controls": id,
          "aria-pressed": recording,
          onClick: startRecording,
        },
        React.createElement(FormattedMessage, {
          id: "widget.todo.record",
          defaultMessage: "Change",
        }),
      ),
      React.createElement(
        "button",
        {
          type: "button",
          className: "button button--secondary",
          style: { flexShrink: 0 },
          disabled: !shortcut,
          "aria-controls": id,
          "aria-label": formatMessage({
            id: "widget.todo.clearShortcut",
            defaultMessage: "Clear shortcut",
          }),
          onClick: () => onChange(""),
        },
        React.createElement(FormattedMessage, {
          id: "widget.todo.deleteShortcut",
          defaultMessage: "Delete",
        }),
      ),
    ),
  );
}
