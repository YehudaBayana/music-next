export function buildEndpoint( //<T extends SpotifyApiEndpoint>
  endpoint: string,
  params: Record<string, string>
): string {
  return endpoint.replace(/\{(\w+)\}/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing parameter: ${key}`);
    }
    return params[key];
  });
}

export function msToMinutesAndSeconds(ms: number | undefined): string {
  if (!ms) {
    return '';
  }
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds;
}

export async function catchError<T>(
  promise: Promise<T>
): Promise<[undefined, T] | [Error]> {
  return promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });
}

export function extractPlaylistItems(
  playHistoryItems: Spotify.PlayHistory[]
): string[] {
  const playlistSet = new Set<string>();

  for (const item of playHistoryItems) {
    const context = item.context;
    if (context && context.type === 'playlist') {
      // Extract playlist ID from context URI (e.g., "spotify:playlist:12345")
      const playlistId = context.uri.split(':')[2];
      playlistSet.add(playlistId);
    }
  }
  return Array.from(playlistSet);
}
