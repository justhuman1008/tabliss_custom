import React, { FC } from "react";
import { useFeatherIcons } from "./useFeatherIcons";

type Props = {
  colour?: string;
  name: string;
  size?: number | string;
};

const uiIcons = UI_ICONS;

const Icon: FC<Props> = ({ colour = "currentColor", name, size = 24 }) => {
  const builtIn = uiIcons[name];
  const icons = useFeatherIcons(typeof builtIn !== "string");
  const markup = builtIn ?? icons?.[name];
  return (
    <i>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={colour}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        dangerouslySetInnerHTML={{
          __html: typeof markup === "string" ? markup : "",
        }}
      />
    </i>
  );
};

export default Icon;
