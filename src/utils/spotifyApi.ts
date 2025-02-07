// utils/spotifyApi.ts

import { SPOTIFY_API_URL } from '@/utils/constants';
import { GetPlaylistTracksRes, SearchSpotifyResponse } from '@/utils/types';
import { buildEndpoint } from '@/utils/utils';

export type SpotifyApiGetEndpoints =
  | '/albums'
  | '/albums/{id}'
  | '/artists'
  | '/artists/{id}'
  | '/artists/{id}/albums'
  | '/tracks/{id}'
  | '/playlists/{id}'
  | '/playlists/{playlist_id}/tracks'
  | '/me'
  | '/me/albums'
  | '/me/playlists'
  | '/me/tracks'
  | '/browse/new-releases'
  | '/browse/featured-playlists'
  | '/browse/categories';

export type SpotifyApiPostEndpoints =
  | '/playlists/{id}/tracks'
  | '/me/albums'
  | '/me/tracks';

export type SpotifyApiPutEndpoints =
  | '/playlists/{id}'
  | '/me/tracks'
  | '/me/albums';

export type SpotifyApiDeleteEndpoints =
  | '/me/albums'
  | '/me/tracks'
  | '/playlists/{id}/tracks';

export type SpotifyApiEndpoint =
  | SpotifyApiGetEndpoints
  | SpotifyApiPostEndpoints
  | SpotifyApiPutEndpoints
  | SpotifyApiDeleteEndpoints;


export const spotifyApi = {
  get: async <T>(endpoint: string, accessToken: string): Promise<T> => {
    const res = await fetch(`${SPOTIFY_API_URL}${endpoint}`, {
      method: 'GET',
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
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
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
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
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
      method: 'DELETE',
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

// export const getTracks = async (
//   id: string,
//   accessToken: string,
//   offset: number = 0,
//   limit: number = 20 // Default Spotify limit for pagination
// ) => {
//   const endpoint = buildEndpoint('/playlists/{playlist_id}/tracks', {
//     playlist_id: id,
//   }) as SpotifyApiGetEndpoints;

//   const queryParams = `?offset=${offset}&limit=${limit}`;

//   try {
//     const res = await spotifyApi.get<GetPlaylistTracksRes>(
//       `${endpoint}${queryParams}` as SpotifyApiGetEndpoints,
//       accessToken || ''
//     );
//     return res.items.map((item) => item.track);
//   } catch (error) {
//     console.error('Error fetching tracks:', error);
//     return [];
//   }
// };

export const searchSpotify = async (
  query: string,
  accessToken: string,
  type: string = 'track,album,artist,playlist', // Default to searching all types
  offset: number = 0,
  limit: number = 20
): Promise<SearchSpotifyResponse | null> => {
  if (!query) return null;

  const endpoint = '/search';
  const queryParams = `?q=${encodeURIComponent(
    query
  )}&type=${type}&offset=${offset}&limit=${limit}`;

  try {
    const res = await spotifyApi.get<SearchSpotifyResponse>(
      `${endpoint}${queryParams}`,
      accessToken
    );
    return res;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
};

export const fetchUserPlaylists = async <T>(
  userId: string,
  accessToken: string,
  limit = 1
): Promise<T> => {
  const res = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) throw new Error('Failed to fetch playlists');

  const data: T = await res.json();
  return data; // Returns array of playlists
};
