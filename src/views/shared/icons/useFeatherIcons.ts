import { useEffect, useState } from "react";

type Icons = Readonly<Record<string, string>>;

let catalog: Icons | undefined;
let request: Promise<Icons> | undefined;

export function useFeatherIcons(enabled = true) {
  const [icons, setIcons] = useState(catalog);

  useEffect(() => {
    if (!enabled) return;
    if (catalog) {
      setIcons(catalog);
      return;
    }

    request ??= import(
      /* webpackChunkName: "feather-icons" */ "feather-icons/dist/icons.json"
    )
      .then(({ default: icons }) => (catalog = icons))
      .catch((error) => {
        request = undefined;
        throw error;
      });

    let active = true;
    request.then(
      (result) => {
        if (active) setIcons(result);
      },
      () => {},
    );
    return () => {
      active = false;
    };
  }, [enabled]);

  return icons;
}
