import React from "react";
import { lastUploadIndex, rememberUploadIndex } from "../../../db/action";
import { db } from "../../../db/state";
import { useValue } from "../../../lib/db/react";
import { useObjectUrl } from "../../../hooks";
import Backdrop from "../../../views/shared/Backdrop";
import "./Image.sass";
import { defaultCache, Props } from "./types";

const Image: React.FC<Props> = ({ cache = defaultCache }) => {
  const { id } = useValue(db, "background");
  const index = React.useMemo(() => {
    const saved = lastUploadIndex(id);
    return saved !== undefined && saved >= 0 && saved < cache.length
      ? saved
      : Math.floor(Math.random() * cache.length);
  }, [id, cache.length]);
  React.useLayoutEffect(() => rememberUploadIndex(id, index), [id, index]);
  const url = useObjectUrl(cache[index]);

  if (!url) return <div className="Image default fullscreen" />;

  return (
    <Backdrop
      className="Image fullscreen"
      style={{ backgroundImage: url ? `url(${url})` : undefined }}
    />
  );
};

export default Image;
