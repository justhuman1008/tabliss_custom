import React from "react";
import { useLocalCredential } from "../../../hooks/useLocalCredential";
import Backdrop from "../../../views/shared/Backdrop";
import {
  backgroundApiFailure,
  clearBackgroundError,
  Credential,
  giphyKeyStorage,
} from "../BackgroundApiKey";
import { getGif } from "./api";
import Credit from "./Credit";
import { defaultData, Props } from "./types";
import "./Giphy.sass";

export default function Giphy({ data = defaultData, loader }: Props) {
  const credential = useLocalCredential<Credential>(giphyKeyStorage);
  const [result, setResult] = React.useState<
    (Awaited<ReturnType<typeof getGif>> & { revision: string }) | null
  >(null);
  const { tag, nsfw, expand } = data;
  React.useEffect(() => {
    clearBackgroundError(giphyKeyStorage);
    if (!credential) return;
    const controller = new AbortController();
    const { signal } = controller;
    loader.push();
    getGif({ tag, nsfw }, credential.value, signal)
      .then((image) => {
        if (!signal.aborted)
          setResult({ revision: credential.revision, ...image });
      })
      .catch((error) => {
        if (!signal.aborted) {
          setResult(null);
          backgroundApiFailure(giphyKeyStorage, error);
        }
      })
      .finally(loader.pop);
    return () => controller.abort();
  }, [credential, tag, nsfw]);
  const image =
    credential && result?.revision === credential.revision ? result : null;
  return image
    ? React.createElement(
        "div",
        { className: "Giphy fullscreen" },
        React.createElement(Backdrop, {
          className: "gif fullscreen",
          style: {
            backgroundImage: `url("${image.url}")`,
            backgroundSize: expand ? "cover" : undefined,
          },
        }),
        React.createElement(Credit, { link: image.link }),
      )
    : React.createElement("div", { className: "Image default fullscreen" });
}
