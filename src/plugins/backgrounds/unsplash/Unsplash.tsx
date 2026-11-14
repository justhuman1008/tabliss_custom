import React from "react";
import { useTimeReached } from "../../../hooks";
import { useLocalCredential } from "../../../hooks/useLocalCredential";
import Backdrop from "../../../views/shared/Backdrop";
import {
  backgroundApiFailure,
  clearBackgroundError,
  Credential,
  unsplashKeyStorage,
} from "../BackgroundApiKey";
import { buildLink, fetchImages } from "./api";
import { defaultData, Props } from "./types";
import UnsplashCredit from "./UnsplashCredit";
import "./Unsplash.sass";

export default function UnsplashBackground(props: Props) {
  const credential = useLocalCredential<Credential>(unsplashKeyStorage);
  const { data = defaultData, setData } = props;
  React.useEffect(() => {
    if (data.timeout === Number.MAX_SAFE_INTEGER)
      setData({ ...data, paused: true, timeout: defaultData.timeout });
  }, []);
  return credential
    ? React.createElement(UnsplashPhotos, {
        ...props,
        credential,
        key: credential.revision,
      })
    : React.createElement("div", { className: "Image default fullscreen" });
}

function UnsplashPhotos({
  cache,
  data = defaultData,
  loader,
  setCache,
  setData,
  credential,
}: Props & { credential: Credential }) {
  const { by, collections, featured, search, topics, paused, timeout } = data;
  const query = JSON.stringify([by, collections, featured, search, topics]);
  const photos =
    cache?.revision === credential.revision && cache.query === query
      ? cache
      : undefined;
  const entered = React.useRef(true);
  const interval = (timeout ?? defaultData.timeout) * 1000;
  const rotationDue = useTimeReached(
    photos && !paused && interval > 0 && photos.cursor < photos.items.length - 1
      ? photos.rotated + interval
      : Infinity,
  );

  React.useEffect(() => {
    if (!photos) return;
    if (
      photos.cursor < photos.items.length - 1 &&
      !paused &&
      ((interval === 0 && entered.current) || rotationDue)
    ) {
      setCache({ ...photos, cursor: photos.cursor + 1, rotated: Date.now() });
    }
    entered.current = false;
  }, [photos, rotationDue, interval, paused]);

  const cursor = photos?.cursor ?? 0;
  const needsPhotos = !photos || cursor === photos.items.length - 1;
  React.useEffect(() => {
    if (!needsPhotos) return;
    clearBackgroundError(unsplashKeyStorage);
    const controller = new AbortController();
    const { signal } = controller;
    loader.push();
    fetchImages(data, credential.value, signal)
      .then((items) => {
        if (signal.aborted) return;
        setCache((previous) => {
          if (
            photos &&
            previous?.revision === credential.revision &&
            previous.query === query
          ) {
            const keep = Math.max(0, previous.cursor - 9);
            return {
              ...previous,
              cursor: previous.cursor - keep,
              items: [...previous.items.slice(keep), ...items],
            };
          }
          entered.current = false;
          return {
            revision: credential.revision,
            query,
            items,
            cursor: 0,
            rotated: Date.now(),
          };
        });
      })
      .catch((error) => {
        if (!signal.aborted) backgroundApiFailure(unsplashKeyStorage, error);
      })
      .finally(loader.pop);
    return () => controller.abort();
  }, [query, needsPhotos, cursor]);

  const photo = photos?.items[cursor];
  const url = photo ? buildLink(photo.src) : undefined;
  const move = (step: number) =>
    photos?.items[cursor + step]
      ? () =>
          setCache({ ...photos, cursor: cursor + step, rotated: Date.now() })
      : null;
  return React.createElement(
    "div",
    { className: "Unsplash fullscreen" },
    React.createElement(Backdrop, {
      className: "image fullscreen",
      ready: Boolean(url),
      style: { backgroundImage: url ? `url(${url})` : undefined },
    }),
    photo &&
      React.createElement(UnsplashCredit, {
        credit: photo.credit,
        paused: paused ?? false,
        onPause: () => setData({ ...data, paused: !paused }),
        onPrev: move(-1),
        onNext: move(1),
      }),
  );
}
