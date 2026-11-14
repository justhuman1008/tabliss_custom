import { API } from "../../types";
import { State } from "./reducer";

export type Data = {
  items: State;
  show: number;
  keyBind?: string;
};

export type Props = API<Data>;

export const todoShortcut = (data?: Data): string => data?.keyBind ?? "T";

export const defaultData: Data = {
  items: [],
  show: 3,
  keyBind: "T",
};
