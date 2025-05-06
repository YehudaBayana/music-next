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
    const url = endpoint.startsWith('https')
      ? endpoint
      : `https://api.spotify.com/v1/${endpoint}${
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
      console.log('yuda error ', error);
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

  // ======================
  // Search Endpoints
  // ======================

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

  // ======================
  // Playlists Endpoints
  // ======================

  public followPlaylist = async (playlistId: string): Promise<void> =>
    this.request(`playlists/${playlistId}/followers`, undefined, 'PUT');

  public getPlaylistItems = async (
    id: string,
    params?: {
      fields?: string;
      limit?: number;
      offset?: number;
      market?: string;
    },
    url?: string
  ): Promise<Spotify.PlaylistTrackResponse> =>
    this.request(url ? url : `playlists/${id}/tracks`, params);

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

  public getQueue = async (): Promise<{
    queue: Spotify.Track[];
    currently_playing: Spotify.Track;
  }> => this.request('me/player/queue');

  public getAlbumTracks = async (
    id: string,
    params?: { limit?: number; offset?: number; market?: string }
  ): Promise<Spotify.PagingObject<Spotify.Track>> =>
    this.request(`albums/${id}/tracks`, params);

  public getCurrentUserProfile = async (): Promise<Spotify.User> =>
    this.request('me');

  public getSavedTracks = async (params?: {
    limit?: number;
    offset?: number;
    market?: string;
  }): Promise<Spotify.PagingObject<Spotify.SavedTrack>> =>
    this.request('me/tracks', params);
}

export const spotifyClient = SpotifyClient.getInstance();
