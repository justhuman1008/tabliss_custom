import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getJoke } from "./api";
import {
  defaultData,
  isSingleJoke,
  isTwoPartJoke,
  Props,
  selectedJokeCategories,
} from "./types";
import "./Joke.sass";

export default function Joke({
  cache,
  data = defaultData,
  setCache,
  loader,
}: Props) {
  const locale = useIntl().locale.split("-")[0];
  const language = ["cs", "de", "en", "es", "fr", "pt"].includes(locale)
    ? locale
    : "en";
  const categories = selectedJokeCategories(data).join(",");
  const request = categories + "?safe-mode&lang=" + language;
  const current = cache?.request === request ? cache : undefined;
  const [revealed, setRevealed] = React.useState<number | null>(null);
  const nextRefresh = current
    ? current.timestamp + (data.timeout ?? defaultData.timeout)
    : 0;
  React.useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(
      async () => {
        loader.push();
        try {
          const result = await getJoke(request, controller.signal);
          if (!controller.signal.aborted)
            setCache({ request, timestamp: Date.now(), result });
        } catch {
          if (!controller.signal.aborted)
            setCache({
              request,
              timestamp: Date.now(),
              result: { error: true },
            });
        } finally {
          loader.pop();
        }
      },
      Math.max(0, nextRefresh - Date.now()),
    );
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [request, nextRefresh]);

  const joke = current?.result;
  if (!joke) return null;
  if (joke.error)
    return React.createElement(
      "div",
      { className: "joke-container" },
      React.createElement(FormattedMessage, {
        id: "widget.joke.unavailable",
        defaultMessage: "A joke could not be loaded.",
      }),
    );
  if (isSingleJoke(joke))
    return React.createElement(
      "div",
      { className: "joke-container" },
      React.createElement("h5", null, joke.joke),
    );
  if (!isTwoPartJoke(joke) || !current) return null;

  const isQuestion = joke.setup.endsWith("?");
  const shown = revealed === current.timestamp;
  return React.createElement(
    "div",
    { className: "joke-container" },
    React.createElement(
      "h5",
      null,
      isQuestion
        ? React.createElement(
            "button",
            {
              type: "button",
              className: "question-joke-setup",
              "aria-expanded": shown,
              onClick: () => setRevealed(shown ? null : current.timestamp),
            },
            joke.setup,
          )
        : joke.setup,
    ),
    (!isQuestion || shown) && React.createElement("h5", null, joke.delivery),
  );
}
