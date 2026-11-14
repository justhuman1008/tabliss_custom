import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { db } from "../../../db/state";
import { useValue } from "../../../lib/db/react";
import { formatTodoShortcut } from "./TodoShortcutControl";
import { Data, todoShortcut } from "./types";

export default function TodoDescription({ id }: { id: string }) {
  const shortcut = todoShortcut(
    useValue(db, ("data/" + id) as `data/${string}`) as Data | undefined,
  );
  const { formatMessage } = useIntl();
  return shortcut ? (
    <FormattedMessage
      id="widget/todo.description"
      defaultMessage="Press <strong>{key}</strong> to add a task."
      values={{
        key: formatTodoShortcut(shortcut, formatMessage),
        strong: (chunks) => <strong>{chunks}</strong>,
      }}
    />
  ) : (
    <FormattedMessage
      id="widget.todo.descriptionNoShortcut"
      defaultMessage="Keep track of your tasks."
    />
  );
}
