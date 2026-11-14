import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import TodoDescription from "../../plugins/widgets/todo/TodoDescription";
import { setWidgetDisplay } from "../../db/action";
import { WidgetState } from "../../db/state";
import { useToggle } from "../../hooks";
import { getConfig } from "../../plugins";
import { DownIcon, Icon, IconButton, RemoveIcon, UpIcon } from "../shared";
import PluginContainer from "../shared/Plugin";
import ToggleSection from "../shared/ToggleSection";
import "./Widget.sass";
import WidgetDisplay from "./WidgetDisplay";

interface Props {
  plugin: WidgetState;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
}

const Widget: React.FC<Props> = ({
  plugin,
  onMoveDown,
  onMoveUp,
  onRemove,
}) => {
  const { formatMessage } = useIntl();
  const [isOpen, toggleIsOpen] = useToggle(onRemove === undefined);

  const { description, name, settingsComponent } = getConfig(plugin.key);

  const setDisplay = setWidgetDisplay.bind(null, plugin.id);

  return (
    <fieldset className="Widget">
      <div className="title--buttons">
        <IconButton
          onClick={onRemove}
          title={formatMessage({
            id: "widget.controls.remove",
            defaultMessage: "Remove widget",
          })}
        >
          <RemoveIcon />
        </IconButton>

        <IconButton
          onClick={toggleIsOpen}
          title={formatMessage(
            isOpen
              ? {
                  id: "widget.controls.close",
                  defaultMessage: "Close settings",
                }
              : { id: "widget.controls.open", defaultMessage: "Edit settings" },
          )}
        >
          <Icon name="settings" />
        </IconButton>

        {onMoveDown && (
          <IconButton
            onClick={onMoveDown}
            title={formatMessage({
              id: "widget.controls.moveDown",
              defaultMessage: "Move widget down",
            })}
          >
            <DownIcon />
          </IconButton>
        )}

        {onMoveUp && (
          <IconButton
            onClick={onMoveUp}
            title={formatMessage({
              id: "widget.controls.moveUp",
              defaultMessage: "Move widget up",
            })}
          >
            <UpIcon />
          </IconButton>
        )}

        <h4 onClick={toggleIsOpen}>
          {formatMessage({ id: plugin.key + ".name", defaultMessage: name })}
        </h4>
        {!isOpen && (
          <p>
            {plugin.key === "widget/todo" ? (
              <TodoDescription id={plugin.id} />
            ) : (
              formatMessage({
                id: plugin.key + ".description",
                defaultMessage: description,
              })
            )}
          </p>
        )}
      </div>

      {isOpen && (
        <div>
          {settingsComponent && (
            <div className="settings">
              <PluginContainer id={plugin.id} component={settingsComponent} />
            </div>
          )}

          <ToggleSection name="Display Settings" messageId="settings.display">
            <WidgetDisplay display={plugin.display} onChange={setDisplay} />
          </ToggleSection>

          <ToggleSection name="Font Settings" messageId="settings.font">
            <>
              <label>
                <FormattedMessage
                  id="widget.display.font"
                  defaultMessage="Font"
                />
                <input
                  type="text"
                  value={plugin.display.fontFamily}
                  onChange={(event) =>
                    setDisplay({ fontFamily: event.target.value })
                  }
                />
              </label>

              <label>
                <FormattedMessage
                  id="widget.display.weight"
                  defaultMessage="Weight"
                />
                <select
                  value={plugin.display.fontWeight}
                  onChange={(event) =>
                    setDisplay({
                      fontWeight: event.target.value
                        ? Number(event.target.value)
                        : undefined,
                    })
                  }
                >
                  <option value="">
                    <FormattedMessage
                      id="widget.font.weight.default"
                      defaultMessage="Default"
                    />
                  </option>
                  <option value="100">
                    <FormattedMessage
                      id="widget.font.weight.thin"
                      defaultMessage="Thin"
                    />
                  </option>
                  <option value="300">
                    <FormattedMessage
                      id="widget.font.weight.light"
                      defaultMessage="Light"
                    />
                  </option>
                  <option value="400">
                    <FormattedMessage
                      id="widget.font.weight.regular"
                      defaultMessage="Regular"
                    />
                  </option>
                  <option value="500">
                    <FormattedMessage
                      id="widget.font.weight.medium"
                      defaultMessage="Medium"
                    />
                  </option>
                  <option value="700">
                    <FormattedMessage
                      id="widget.font.weight.bold"
                      defaultMessage="Bold"
                    />
                  </option>
                  <option value="900">
                    <FormattedMessage
                      id="widget.font.weight.black"
                      defaultMessage="Black"
                    />
                  </option>
                </select>
              </label>

              <label>
                <FormattedMessage
                  id="widget.display.colour"
                  defaultMessage="Colour"
                />
                <input
                  type="color"
                  value={plugin.display.colour ?? "#ffffff"}
                  onChange={(event) =>
                    setDisplay({ colour: event.target.value })
                  }
                />
              </label>
            </>
          </ToggleSection>
        </div>
      )}
    </fieldset>
  );
};

export default Widget;
