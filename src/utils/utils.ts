import { SpotifyApiEndpoint } from "@/utils/spotifyApi";

export function buildEndpoint<T extends SpotifyApiEndpoint>(
  endpoint: T,
  params: Record<string, string>
): string {
  return endpoint.replace(/\{(\w+)\}/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing parameter: ${key}`);
    }
    return params[key];
  });
}

export function msToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds;
}
