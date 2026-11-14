import { readBackgroundResponse } from "../apiResponse";
import type { Data } from "./types";
export async function getGif(
  { tag, nsfw }: Pick<Data, "tag" | "nsfw">,
  apiKey: string,
  signal: AbortSignal,
) {
  const tags = tag.split(",").map((value) => value.trim());
  const selected = tags[Math.floor(Math.random() * tags.length)];
  const params = new URLSearchParams({
    api_key: apiKey,
    rating: nsfw ? "r" : "g",
  });
  if (selected) params.set("tag", selected);
  const response = await fetch(
    "https://api.giphy.com/v1/gifs/random?" + params,
    { signal, cache: "no-store" },
  );
  const { data } = await readBackgroundResponse<{
    data?: {
      images?: { original?: { webp?: string; url?: string } };
      url?: string;
    };
  }>(response);
  const url = data?.images?.original?.webp || data?.images?.original?.url;
  if (!url) throw new Error("GIPHY returned no image");
  return { url, link: data?.url };
}
