import { JokeAPIResponse } from "./types";

export async function getJoke(
  request: string,
  signal: AbortSignal,
): Promise<JokeAPIResponse> {
  const response = await fetch("https://v2.jokeapi.dev/joke/" + request, {
    signal,
  });
  if (!response.ok) throw new Error("Joke lookup failed");
  return response.json();
}
