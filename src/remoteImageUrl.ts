export function getRemoteImageUrl(value?: string) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    // The URL can be incomplete while it is being entered.
  }
}
