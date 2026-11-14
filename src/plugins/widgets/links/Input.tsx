import { FormattedMessage, useIntl } from "react-intl";
import React, { FC } from "react";

import {
  IconButton,
  RemoveIcon,
  DownIcon,
  UpIcon,
} from "../../../views/shared";
import { useFeatherIcons } from "../../../views/shared/icons/useFeatherIcons";
import { Link } from "./types";

type Props = Link & {
  number: number;
  onChange: (values: Partial<Link>) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove: () => void;
};

const Input: FC<Props> = (props) => {
  const { formatMessage, locale } = useIntl();
  const icons = useFeatherIcons();
  const iconList = React.useMemo(() => Object.keys(icons ?? {}), [icons]);
  return (
    <div className="LinkInput">
      <h5>
        <div className="title--buttons">
          <IconButton
            onClick={props.onRemove}
            title={formatMessage({
              id: "widget.links.remove",
              defaultMessage: "Remove link",
            })}
          >
            <RemoveIcon />
          </IconButton>
          {props.onMoveDown && (
            <IconButton
              onClick={props.onMoveDown}
              title={formatMessage({
                id: "widget.links.moveDown",
                defaultMessage: "Move link down",
              })}
            >
              <DownIcon />
            </IconButton>
          )}
          {props.onMoveUp && (
            <IconButton
              onClick={props.onMoveUp}
              title={formatMessage({
                id: "widget.links.moveUp",
                defaultMessage: "Move link up",
              })}
            >
              <UpIcon />
            </IconButton>
          )}
        </div>

        <FormattedMessage
          id={
            props.number <= 9
              ? "widget.links.numberedShortcut"
              : "widget.links.shortcut"
          }
          defaultMessage={
            props.number <= 9 ? "Keyboard shortcut {number}" : "Shortcut"
          }
          values={{ number: props.number }}
        />
      </h5>

      <label>
        <FormattedMessage id="widget.links.url" defaultMessage="URL" />
        <input
          type="url"
          value={props.url}
          onChange={(event) => props.onChange({ url: event.target.value })}
        />
      </label>

      <label>
        <FormattedMessage id="widget.links.name" defaultMessage="Name" />{" "}
        <span
          className="text--grey"
          style={locale === "ko" ? { fontSize: "0.8em" } : undefined}
        >
          <FormattedMessage
            id="widget.links.optional"
            defaultMessage="(optional)"
          />
        </span>
        <input
          type="text"
          value={props.name}
          onChange={(event) => props.onChange({ name: event.target.value })}
        />
      </label>

      <label>
        <FormattedMessage id="widget.links.icon" defaultMessage="Icon" />{" "}
        <span
          className="text--grey"
          style={locale === "ko" ? { fontSize: "0.8em" } : undefined}
        >
          <FormattedMessage
            id="widget.links.optional"
            defaultMessage="(optional)"
          />
        </span>
        <select
          value={props.icon}
          onChange={(event) => props.onChange({ icon: event.target.value })}
        >
          <option value={""}>
            <FormattedMessage
              id="widget.links.icon.none"
              defaultMessage="None"
            />
          </option>
          <option value="_favicon">
            <FormattedMessage
              id="widget.links.icon.favicon"
              defaultMessage="Website Icon"
            />
          </option>
          <option value="_image">
            <FormattedMessage
              id="widget.links.icon.imageUrl"
              defaultMessage="Image URL"
            />
          </option>
          <optgroup
            label={formatMessage({
              id: "widget.links.icon.feather",
              defaultMessage: "Feather Icons",
            })}
          >
            {!icons && props.icon && !props.icon.startsWith("_") && (
              <option value={props.icon}>{props.icon}</option>
            )}
            {iconList.map((key) => (
              <option key={key}>{key}</option>
            ))}
          </optgroup>
        </select>
      </label>

      {props.icon === "_image" && (
        <label>
          <FormattedMessage
            id="widget.links.icon.imageAddress"
            defaultMessage="Icon image URL"
          />
          <input
            type="url"
            value={props.iconImageUrl ?? ""}
            onChange={(event) =>
              props.onChange({ iconImageUrl: event.target.value })
            }
          />
        </label>
      )}
      <hr />
    </div>
  );
};

export default Input;
