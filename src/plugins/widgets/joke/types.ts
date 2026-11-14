import { API } from "../../types";
import categories from "./categories";
import { MINUTES } from "../../../utils";

type JokeAPIType = "single" | "twopart";

type BaseJokeAPIResponse = {
  error: boolean;
  category: JokeAPICategory;
  type: JokeAPIType;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean;
  };
  id: number;
  safe: boolean;
  lang: string;
  timestamp: number;
};

export interface SingleJokeAPIResponse extends BaseJokeAPIResponse {
  joke: string;
}

export interface TwoPartJokeAPIResponse extends BaseJokeAPIResponse {
  setup: string;
  delivery: string;
}

export type JokeAPIResponse =
  | SingleJokeAPIResponse
  | TwoPartJokeAPIResponse
  | JokeApiErrorResponse;

export type JokeApiErrorResponse = {
  error: boolean;
  internalError: boolean;
  code: number;
  message: string;
  causedBy: string[];
  additionalInfo: string;
  timestamp: number;
};

export function isSingleJoke(
  joke: Cache["result"],
): joke is SingleJokeAPIResponse {
  return !joke.error && (joke as SingleJokeAPIResponse).type === "single";
}

export function isTwoPartJoke(
  joke: Cache["result"],
): joke is TwoPartJokeAPIResponse {
  return !joke.error && (joke as TwoPartJokeAPIResponse).type === "twopart";
}

export function isJokeError(
  joke: Cache["result"],
): joke is JokeApiErrorResponse {
  return joke.error;
}

export type JokeAPICategory = (typeof categories)[number]["key"];
export type Data = {
  categories: JokeAPICategory[];
  timeout: number;
};

export type Cache = {
  request: string;
  timestamp: number;
  result: JokeAPIResponse | { error: true };
};

export type Props = API<Data, Cache>;

export const defaultData: Data = {
  categories: ["any"],
  timeout: 5 * MINUTES,
};

export function selectedJokeCategories(data: Data): JokeAPICategory[] {
  const selected = Array.isArray(data.categories)
    ? data.categories
    : (data.categories as unknown) instanceof Set
      ? [...(data.categories as unknown as Set<JokeAPICategory>)]
      : [];
  const valid = selected.filter((key) =>
    categories.some((category) => category.key === key),
  );
  return !valid.length || valid.includes("any") ? ["any"] : valid;
}
