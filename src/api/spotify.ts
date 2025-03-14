import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';

// Core API Handler with full method support

// lib/spotify-client.ts
class SpotifyClient {
  private static instance: SpotifyClient;
  private accessToken: string | null = null;

  private constructor() {}

  public static getInstance(): SpotifyClient {
    if (!SpotifyClient.instance) {
      SpotifyClient.instance = new SpotifyClient();
    }
    return SpotifyClient.instance;
  }

  public setAccessToken(token: string) {
    this.accessToken = token;
  }

  private async request<T>(
    endpoint: string,
    params?: Record<string, any>,
    method: string = 'GET',
    body?: object
  ): Promise<T> {
    if (!this.accessToken) {
      throw new Error('error: no access token in endpoint: ' + endpoint);
    }

    const processedParams = params
      ? Object.fromEntries(
          Object.entries(params).map(([key, val]) => [
            key,
            Array.isArray(val) ? val.join(',') : val.toString(),
          ])
        )
      : {};

    const queryString = new URLSearchParams(
      processedParams as Record<string, string>
    ).toString();
    const url = `https://api.spotify.com/v1/${endpoint}${
      queryString ? `?${queryString}` : ''
    }`;

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Spotify API Error [${response.status}]: ${error.error.message}`
      );
    }

    return response.json() as Promise<T>;
  }

  // Example endpoint methods

  public getTrack = async (id: string, params?: any) => {
    return this.request<Spotify.Track>(`tracks/${id}`, params);
  };

  public search = async (
    query: string,
    types: string[] = ['track'],
    params?: { market?: string; limit?: number; offset?: number }
  ): Promise<Spotify.SearchResult> =>
    this.request('search', {
      q: query,
      type: types.join(','),
      ...params,
    });

  public addItemsToPlaylist = async (
    id: string,
    uris: string[],
    position: number = 0
  ): Promise<Spotify.PlaylistSnapshotResponse> =>
    this.request(`playlists/${id}/tracks`, undefined, 'POST', {
      uris,
      position,
    });

  public removeItemsFromPlaylist = async (
    id: string,
    body: { tracks: Array<{ uri: string }>; snapshot_id?: string }
  ): Promise<Spotify.PlaylistSnapshotResponse> =>
    this.request(`playlists/${id}/tracks`, undefined, 'DELETE', body);

  // ======================
  // Player Endpoints
  // ======================

  public getPlaybackState = async (params?: {
    market?: string;
  }): Promise<Spotify.PlayerState> => this.request('me/player', params);

  public transferPlayback = async (
    deviceIds: string[],
    play?: boolean
  ): Promise<void> =>
    this.request('me/player', undefined, 'PUT', {
      device_ids: deviceIds,
      play,
    });

  public getAvailableDevices = async (): Promise<{
    devices: Spotify.Device[];
  }> => this.request('me/player/devices');

  public getCurrentlyPlayingTrack = async (params?: {
    market?: string;
  }): Promise<Spotify.CurrentlyPlaying> =>
    this.request('me/player/currently-playing', params);

  public startPlayback = async (
    params?: { device_id?: string },
    body?: {
      context_uri?: string;
      uris?: string[];
      offset?: { position: number } | { uri: string };
      position_ms?: number;
    }
  ): Promise<void> => this.request('me/player/play', params, 'PUT', body);

  public pausePlayback = async (params?: {
    device_id?: string;
  }): Promise<void> => this.request('me/player/pause', params, 'PUT');

  public skipToNext = async (params?: { device_id?: string }): Promise<void> =>
    this.request('me/player/next', params, 'POST');

  public skipToPrevious = async (params?: {
    device_id?: string;
  }): Promise<void> => this.request('me/player/previous', params, 'POST');

  public seekToPosition = async (
    positionMs: number,
    params?: { device_id?: string }
  ): Promise<void> =>
    this.request(
      'me/player/seek',
      { position_ms: positionMs, ...params },
      'PUT'
    );

  public setRepeatMode = async (
    state: 'track' | 'context' | 'off',
    params?: { device_id?: string }
  ): Promise<void> =>
    this.request('me/player/repeat', { state, ...params }, 'PUT');

  public setPlaybackVolume = async (
    volumePercent: number,
    params?: { device_id?: string }
  ): Promise<void> =>
    this.request(
      'me/player/volume',
      { volume_percent: volumePercent, ...params },
      'PUT'
    );

  public toggleShuffle = async (
    state: 'true' | 'false',
    params?: { device_id?: string }
  ): Promise<void> =>
    this.request('me/player/shuffle', { state, ...params }, 'PUT');
}

export const spotifyClient = SpotifyClient.getInstance();

const spotifyApi = async <T>(
  endpoint: string,
  params?: Record<string, string | number | string[]>,
  method: string = 'GET',
  body?: object
): Promise<T> => {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;
  if (!accessToken) {
    throw new Error('error: no access token');
  }

  const processedParams = params
    ? Object.fromEntries(
        Object.entries(params).map(([key, val]) => [
          key,
          Array.isArray(val) ? val.join(',') : val.toString(),
        ])
      )
    : {};

  const queryString = new URLSearchParams(
    processedParams as Record<string, string>
  ).toString();
  const url = `https://api.spotify.com/v1/${endpoint}${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Spotify API Error [${response.status}]: ${error.error.message}`
    );
  }

  return response.json() as Promise<T>;
};

// ======================
// Albums Endpoints
// ======================

export const getAlbum = async (
  id: string,
  params?: { market?: string }
): Promise<Spotify.Album> => spotifyApi(`albums/${id}`, params);

export const getSeveralAlbums = async (
  ids: string[],
  params?: { market?: string }
): Promise<{ albums: Spotify.Album[] }> =>
  spotifyApi('albums', { ...params, ids: ids.join(',') });

export const getCurrentUserAlbums = async (params?: {
  market?: string;
  limit?: number;
  offset?: number;
}): Promise<Spotify.PagingObject<{ album: Spotify.Album }>> =>
  spotifyApi('/me/albums', { ...params });

export const getAlbumTracks = async (
  id: string,
  params?: { limit?: number; offset?: number; market?: string }
): Promise<Spotify.PagingObject<Spotify.Track>> =>
  spotifyApi(`albums/${id}/tracks`, params);

export const saveAlbumsForCurrentUser = async (ids: string[]): Promise<void> =>
  spotifyApi('me/albums', undefined, 'PUT', { ids });

export const removeAlbumsForCurrentUser = async (
  ids: string[]
): Promise<void> => spotifyApi('me/albums', undefined, 'DELETE', { ids });

export const checkSavedAlbums = async (ids: string[]): Promise<boolean[]> =>
  spotifyApi('me/albums/contains', { ids: ids.join(',') });

// ======================
// Artists Endpoints
// ======================

export const getArtist = async (id: string): Promise<Spotify.Artist> =>
  spotifyApi(`artists/${id}`);

export const getSeveralArtists = async (
  ids: string[]
): Promise<{ artists: Spotify.Artist[] }> =>
  spotifyApi('artists', { ids: ids.join(',') });

export const getArtistAlbums = async (
  id: string,
  params?: {
    include_groups?: 'album' | 'single' | 'appears_on' | 'compilation';
    market?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Spotify.PagingObject<Spotify.Album>> =>
  spotifyApi(`artists/${id}/albums`, params);

export const getArtistTopTracks = async (
  id: string,
  params: { market: string }
): Promise<{ tracks: Spotify.Track[] }> =>
  spotifyApi(`artists/${id}/top-tracks`, params);

export const getRelatedArtists = async (
  id: string
): Promise<{ artists: Spotify.Artist[] }> =>
  spotifyApi(`artists/${id}/related-artists`);

// ======================
// Tracks Endpoints
// ======================

export const getTrack = async (
  id: string,
  params?: { market?: string }
): Promise<Spotify.Track> => spotifyApi(`tracks/${id}`, params);

export const getSeveralTracks = async (
  ids: string[],
  params?: { market?: string }
): Promise<{ tracks: Spotify.Track[] }> =>
  spotifyApi('tracks', { ...params, ids: ids.join(',') });

export const getTrackAudioAnalysis = async (
  id: string
): Promise<Spotify.AudioAnalysis> => spotifyApi(`audio-analysis/${id}`);

export const getTrackAudioFeatures = async (
  id: string
): Promise<Spotify.AudioFeatures> => spotifyApi(`audio-features/${id}`);

export const getSeveralAudioFeatures = async (
  ids: string[]
): Promise<{ audio_features: Spotify.AudioFeatures[] }> =>
  spotifyApi('audio-features', { ids: ids.join(',') });

export const saveTracksForCurrentUser = async (ids: string[]): Promise<void> =>
  spotifyApi('me/tracks', undefined, 'PUT', { ids });

export const removeSavedTracksForCurrentUser = async (
  ids: string[]
): Promise<void> => spotifyApi('me/tracks', undefined, 'DELETE', { ids });

export const checkSavedTracks = async (ids: string[]): Promise<boolean[]> =>
  spotifyApi('me/tracks/contains', { ids: ids.join(',') });

// // ======================
// // Player Endpoints
// // ======================

// export const getPlaybackState = async (params?: {
//   market?: string;
// }): Promise<Spotify.PlayerState> => spotifyApi('me/player', params);

// export const transferPlayback = async (
//   deviceIds: string[],
//   play?: boolean
// ): Promise<void> =>
//   spotifyApi('me/player', undefined, 'PUT', { device_ids: deviceIds, play });

// export const getAvailableDevices = async (): Promise<{
//   devices: Spotify.Device[];
// }> => spotifyApi('me/player/devices');

// export const getCurrentlyPlayingTrack = async (params?: {
//   market?: string;
// }): Promise<Spotify.CurrentlyPlaying> =>
//   spotifyApi('me/player/currently-playing', params);

// export const startPlayback = async (
//   params?: { device_id?: string },
//   body?: {
//     context_uri?: string;
//     uris?: string[];
//     offset?: { position: number } | { uri: string };
//     position_ms?: number;
//   }
// ): Promise<void> => spotifyApi('me/player/play', params, 'PUT', body);

// export const pausePlayback = async (params?: {
//   device_id?: string;
// }): Promise<void> => spotifyApi('me/player/pause', params, 'PUT');

// export const skipToNext = async (params?: {
//   device_id?: string;
// }): Promise<void> => spotifyApi('me/player/next', params, 'POST');

// export const skipToPrevious = async (params?: {
//   device_id?: string;
// }): Promise<void> => spotifyApi('me/player/previous', params, 'POST');

// export const seekToPosition = async (
//   positionMs: number,
//   params?: { device_id?: string }
// ): Promise<void> =>
//   spotifyApi('me/player/seek', { position_ms: positionMs, ...params }, 'PUT');

// export const setRepeatMode = async (
//   state: 'track' | 'context' | 'off',
//   params?: { device_id?: string }
// ): Promise<void> => spotifyApi('me/player/repeat', { state, ...params }, 'PUT');

// export const setPlaybackVolume = async (
//   volumePercent: number,
//   params?: { device_id?: string }
// ): Promise<void> =>
//   spotifyApi(
//     'me/player/volume',
//     { volume_percent: volumePercent, ...params },
//     'PUT'
//   );

// export const toggleShuffle = async (
//   state: 'true' | 'false',
//   params?: { device_id?: string }
// ): Promise<void> =>
//   spotifyApi('me/player/shuffle', { state, ...params }, 'PUT');

// ======================
// Playlists Endpoints
// ======================

export const getPlaylist = async (
  id: string,
  params?: { fields?: string; market?: string }
): Promise<Spotify.Playlist> => spotifyApi(`playlists/${id}`, params);

export const updatePlaylistDetails = async (
  id: string,
  body: { name?: string; description?: string; public?: boolean }
): Promise<void> => spotifyApi(`playlists/${id}`, undefined, 'PUT', body);

export const getPlaylistItems = async (
  id: string,
  params?: { fields?: string; limit?: number; offset?: number; market?: string }
): Promise<{
  newTracks: (Spotify.Track | Spotify.Episode)[];
  hasMoreServer: boolean;
}> => {
  try {
    const res = await spotifyApi<Promise<Spotify.PlaylistTrackResponse>>(
      `playlists/${id}/tracks`,
      params
    );
    const tracks = res.items.map((item) => item.track);
    return { newTracks: tracks, hasMoreServer: tracks.length > 0 };
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return { newTracks: [], hasMoreServer: false };
  }
};

// export const addItemsToPlaylist = async (
//   id: string,
//   uris: string[],
//   position: number = 0
// ): Promise<Spotify.PlaylistSnapshotResponse> =>
//   spotifyApi(`playlists/${id}/tracks`, undefined, 'POST', { uris, position });

// export const removeItemsFromPlaylist = async (
//   id: string,
//   body: { tracks: Array<{ uri: string }>; snapshot_id?: string }
// ): Promise<Spotify.PlaylistSnapshotResponse> =>
//   spotifyApi(`playlists/${id}/tracks`, undefined, 'DELETE', body);

export const reorderPlaylistItems = async (
  id: string,
  body: {
    range_start: number;
    insert_before: number;
    range_length?: number;
    snapshot_id?: string;
  }
): Promise<Spotify.PlaylistSnapshotResponse> =>
  spotifyApi(`playlists/${id}/tracks`, undefined, 'PUT', body);

export const replacePlaylistItems = async (
  id: string,
  uris: string[]
): Promise<Spotify.PlaylistSnapshotResponse> =>
  spotifyApi(`playlists/${id}/tracks`, undefined, 'PUT', { uris });

export const getCurrentUserPlaylists = async (params?: {
  limit?: number;
  offset?: number;
}): Promise<Spotify.PagingObject<Spotify.Playlist>> =>
  spotifyApi('me/playlists', params);

export const getUserPlaylists = async (
  userId: string,
  params?: { limit?: number; offset?: number }
): Promise<Spotify.PagingObject<Spotify.Playlist>> =>
  spotifyApi(`users/${userId}/playlists`, params);

export const createPlaylist = async (
  userId: string,
  body: { name: string; description?: string; public?: boolean }
): Promise<Spotify.Playlist> =>
  spotifyApi(`users/${userId}/playlists`, undefined, 'POST', body);

export const uploadPlaylistCoverImage = async (
  playlistId: string,
  image: string // Base64 encoded JPEG image
): Promise<void> =>
  spotifyApi(`playlists/${playlistId}/images`, undefined, 'PUT', { image });

// ======================
// Browse Endpoints
// ======================

export const getNewReleases = async (params?: {
  country?: string;
  limit?: number;
  offset?: number;
}): Promise<Spotify.PagingObject<Spotify.Album>> =>
  spotifyApi('browse/new-releases', params);

export const getFeaturedPlaylists = async (params?: {
  country?: string;
  limit?: number;
  offset?: number;
}): Promise<Spotify.FeaturedPlaylists> =>
  spotifyApi('browse/featured-playlists', params);

export const getCategories = async (params?: {
  country?: string;
  locale?: string;
  limit?: number;
  offset?: number;
}): Promise<Spotify.PagingObject<Spotify.Category>> =>
  spotifyApi('browse/categories', params);

export const getCategory = async (
  id: string,
  params?: { country?: string; locale?: string }
): Promise<Spotify.Category> => spotifyApi(`browse/categories/${id}`, params);

export const getCategoryPlaylists = async (
  id: string,
  params?: { country?: string; limit?: number; offset?: number }
): Promise<Spotify.PagingObject<Spotify.Playlist>> =>
  spotifyApi(`browse/categories/${id}/playlists`, params);

export const getRecommendations = async (params: {
  seed_artists?: string[];
  seed_genres?: string[];
  seed_tracks?: string[];
  limit?: number;
  market?: string;
  [key: string]: any;
}): Promise<Spotify.Recommendations> =>
  spotifyApi('recommendations', {
    ...params,
  });

export const getAvailableGenreSeeds = async (): Promise<{ genres: string[] }> =>
  spotifyApi('recommendations/available-genre-seeds');

// ======================
// Shows Endpoints
// ======================

export const getShow = async (
  id: string,
  params?: { market?: string }
): Promise<Spotify.Show> => spotifyApi(`shows/${id}`, params);

export const getSeveralShows = async (
  ids: string[],
  params?: { market?: string }
): Promise<{ shows: Spotify.Show[] }> =>
  spotifyApi('shows', { ...params, ids: ids.join(',') });

export const getShowEpisodes = async (
  id: string,
  params?: { limit?: number; offset?: number; market?: string }
): Promise<Spotify.PagingObject<Spotify.Episode>> =>
  spotifyApi(`shows/${id}/episodes`, params);

export const saveShowsForCurrentUser = async (ids: string[]): Promise<void> =>
  spotifyApi('me/shows', undefined, 'PUT', { ids });

export const removeSavedShowsForCurrentUser = async (
  ids: string[]
): Promise<void> => spotifyApi('me/shows', undefined, 'DELETE', { ids });

export const checkSavedShows = async (ids: string[]): Promise<boolean[]> =>
  spotifyApi('me/shows/contains', { ids: ids.join(',') });

// ======================
// Episodes Endpoints
// ======================

export const getEpisode = async (
  id: string,
  params?: { market?: string }
): Promise<Spotify.Episode> => spotifyApi(`episodes/${id}`, params);

export const getSeveralEpisodes = async (
  ids: string[],
  params?: { market?: string }
): Promise<{ episodes: Spotify.Episode[] }> =>
  spotifyApi('episodes', { ...params, ids: ids.join(',') });

export const saveEpisodesForCurrentUser = async (
  ids: string[]
): Promise<void> => spotifyApi('me/episodes', undefined, 'PUT', { ids });

export const removeSavedEpisodesForCurrentUser = async (
  ids: string[]
): Promise<void> => spotifyApi('me/episodes', undefined, 'DELETE', { ids });

export const checkSavedEpisodes = async (ids: string[]): Promise<boolean[]> =>
  spotifyApi('me/episodes/contains', { ids: ids.join(',') });

// ======================
// Users Endpoints
// ======================

export const getUserProfile = async (userId: string): Promise<Spotify.User> =>
  spotifyApi(`users/${userId}`);

export const getCurrentUserProfile = async (): Promise<Spotify.User> =>
  spotifyApi('me');

export const getCurrentUserTopItems = async (
  type: 'tracks' | 'artists',
  params?: { limit?: number; offset?: number; time_range?: string }
): Promise<Spotify.PagingObject<Spotify.Track | Spotify.Artist>> =>
  spotifyApi(`me/top/${type}`, params);

export const followPlaylist = async (playlistId: string): Promise<void> =>
  spotifyApi(`playlists/${playlistId}/followers`, undefined, 'PUT');

export const unfollowPlaylist = async (playlistId: string): Promise<void> =>
  spotifyApi(`playlists/${playlistId}/followers`, undefined, 'DELETE');

export const followArtistsOrUsers = async (
  type: 'artist' | 'user',
  ids: string[]
): Promise<void> => spotifyApi('me/following', undefined, 'PUT', { type, ids });

export const unfollowArtistsOrUsers = async (
  type: 'artist' | 'user',
  ids: string[]
): Promise<void> =>
  spotifyApi('me/following', undefined, 'DELETE', { type, ids });

export const checkIfUserFollowsArtistsOrUsers = async (
  type: 'artist' | 'user',
  ids: string[]
): Promise<boolean[]> =>
  spotifyApi('me/following/contains', { type, ids: ids.join(',') });

// ======================
// Library Endpoints
// ======================

export const getSavedTracks = async (params?: {
  limit?: number;
  offset?: number;
  market?: string;
}): Promise<Spotify.PagingObject<Spotify.SavedTrack>> =>
  spotifyApi('me/tracks', params);

export const getSavedAlbums = async (params?: {
  limit?: number;
  offset?: number;
  market?: string;
}): Promise<Spotify.PagingObject<Spotify.SavedAlbum>> =>
  spotifyApi('me/albums', params);

export const removeSavedAlbumsForCurrentUser = async (
  ids: string[]
): Promise<void> => spotifyApi('me/albums', undefined, 'DELETE', { ids });

export const getSavedEpisodes = async (params?: {
  limit?: number;
  offset?: number;
  market?: string;
}): Promise<Spotify.PagingObject<Spotify.SavedEpisode>> =>
  spotifyApi('me/episodes', params);

export const getSavedShows = async (params?: {
  limit?: number;
  offset?: number;
  market?: string;
}): Promise<Spotify.PagingObject<Spotify.SavedShow>> =>
  spotifyApi('me/shows', params);

// ======================
// Personalization Endpoints
// ======================

export const getCurrentUserTopArtists = async (params?: {
  limit?: number;
  offset?: number;
  time_range?: string;
}): Promise<Spotify.PagingObject<Spotify.Artist>> =>
  spotifyApi('me/top/artists', params);

export const getCurrentUserTopTracks = async (params?: {
  limit?: number;
  offset?: number;
  time_range?: string;
}): Promise<Spotify.PagingObject<Spotify.Track>> =>
  spotifyApi('me/top/tracks', params);

export const getCurrentUserRecentlyPlayed = async (params?: {
  limit?: number;
  after?: number;
  before?: number;
}): Promise<Spotify.CursorBasedPaging<Spotify.PlayHistory>> =>
  spotifyApi('me/player/recently-played', params);

// ======================
// Markets Endpoints
// ======================

export const getAvailableMarkets = async (): Promise<{ markets: string[] }> =>
  spotifyApi('markets');

// ======================
// Categories Endpoints
// ======================

export const getBrowseCategories = async (params?: {
  country?: string;
  locale?: string;
  limit?: number;
  offset?: number;
}): Promise<Spotify.PagingObject<Spotify.Category>> =>
  spotifyApi('browse/categories', params);

// ======================
// Audio Analysis Endpoints
// ======================

export const getAudioAnalysis = async (
  id: string
): Promise<Spotify.AudioAnalysis> => spotifyApi(`audio-analysis/${id}`);

export const getAudioFeatures = async (
  id: string
): Promise<Spotify.AudioFeatures> => spotifyApi(`audio-features/${id}`);

// ======================
// Search Endpoints
// ======================

export const search = async (
  query: string,
  types: string[] = ['track'],
  params?: { market?: string; limit?: number; offset?: number }
): Promise<Spotify.SearchResult> =>
  spotifyApi('search', {
    q: query,
    type: types.join(','),
    ...params,
  });

// ======================
// Chapters Endpoints
// ======================

export const getChapter = async (
  id: string,
  params?: { market?: string }
): Promise<Spotify.Chapter> => spotifyApi(`chapters/${id}`, params);

export const getSeveralChapters = async (
  ids: string[],
  params?: { market?: string }
): Promise<{ chapters: Spotify.Chapter[] }> =>
  spotifyApi('chapters', { ...params, ids: ids.join(',') });

// ======================
// Miscellaneous Endpoints
// ======================

export const getCurrentPlaybackState = async (params?: {
  market?: string;
}): Promise<Spotify.PlayerState> => spotifyApi('me/player', params);

export const getQueue = async (): Promise<{ queue: Spotify.Track[] }> =>
  spotifyApi('me/player/queue');

export const addToQueue = async (
  uri: string,
  params?: { device_id?: string }
): Promise<void> => spotifyApi('me/player/queue', { uri, ...params }, 'POST');
