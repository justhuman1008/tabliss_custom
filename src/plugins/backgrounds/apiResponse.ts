export async function readBackgroundResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok)
    throw Object.assign(new Error("Background API request failed"), {
      status: response.status,
    });
  return response.json();
}
