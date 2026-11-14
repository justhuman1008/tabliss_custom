import { FormattedMessage, useIntl } from "react-intl";
import TodoShortcutControl from "./TodoShortcutControl";
import React, { FC } from "react";

import { Props, defaultData, todoShortcut } from "./types";

const TodoSettings: FC<Props> = ({ data = defaultData, setData }) => {
  const { formatMessage } = useIntl();
  return (
    <div className="SearchSettings">
      <label>
        <FormattedMessage
          id="widget.todo.show"
          defaultMessage="Tasks to show"
        />
        <input
          type="number"
          min="0"
          onChange={(event) =>
            setData({ ...data, show: Number(event.target.value) })
          }
          placeholder={formatMessage({
            id: "widget.todo.showPlaceholder",
            defaultMessage: "Number of todo items to show",
          })}
          value={data.show}
        />
      </label>

      <TodoShortcutControl
        shortcut={todoShortcut(data)}
        onChange={(keyBind) => setData({ ...data, keyBind })}
      />
    </div>
  );
};

export default TodoSettings;
