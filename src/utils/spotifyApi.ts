// utils/spotifyApi.ts

export type SpotifyApiGetEndpoints =
  | "/albums"
  | "/albums/{id}"
  | "/artists"
  | "/artists/{id}"
  | "/artists/{id}/albums"
  | "/tracks/{id}"
  | "/playlists/{id}"
  | "/playlists/{playlist_id}/tracks"
  | "/me"
  | "/me/albums"
  | "/me/playlists"
  | "/me/tracks"
  | "/browse/new-releases"
  | "/browse/featured-playlists"
  | "/browse/categories";

export type SpotifyApiPostEndpoints =
  | "/playlists/{id}/tracks"
  | "/me/albums"
  | "/me/tracks";

export type SpotifyApiPutEndpoints =
  | "/playlists/{id}"
  | "/me/tracks"
  | "/me/albums";

export type SpotifyApiDeleteEndpoints =
  | "/me/albums"
  | "/me/tracks"
  | "/playlists/{id}/tracks";

export type SpotifyApiEndpoint =
  | SpotifyApiGetEndpoints
  | SpotifyApiPostEndpoints
  | SpotifyApiPutEndpoints
  | SpotifyApiDeleteEndpoints;

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const spotifyApi = {
  get: async <T>(
    endpoint: SpotifyApiGetEndpoints,
    accessToken: string
  ): Promise<T> => {
    const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Spotify API Error: ${res.statusText}`);
    }

    return res.json();
  },

  post: async (
    endpoint: SpotifyApiPostEndpoints,
    accessToken: string,
    data: object
  ) => {
    const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Spotify API Error: ${res.statusText}`);
    }

    return res.json();
  },

  put: async (
    endpoint: SpotifyApiPutEndpoints,
    accessToken: string,
    data: object
  ) => {
    const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`Spotify API Error: ${res.statusText}`);
    }

    return res.json();
  },

  delete: async (endpoint: SpotifyApiDeleteEndpoints, accessToken: string) => {
    const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Spotify API Error: ${res.statusText}`);
    }

    return res.json();
  },
};
