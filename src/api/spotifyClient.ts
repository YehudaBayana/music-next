import { throttle, debounce } from 'lodash';

class SpotifyClient {
  private static instance: SpotifyClient;
  private accessToken: string | null = null;
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;
  private rateLimitRetryCount: Record<string, number> = {};

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

  private async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;
    const request = this.requestQueue.shift();

    try {
      await request?.();
    } catch (error) {
      console.error('Error processing queue request:', error);
    } finally {
      this.isProcessingQueue = false;
      this.processQueue(); // Process next request
    }
  }

  private enqueueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      // Start processing the queue if it's not already being processed
      if (!this.isProcessingQueue) {
        this.processQueue();
      }
    });
  }

  private getRetryDelay(endpoint: string): number {
    // Initialize retry count if not exists
    if (!this.rateLimitRetryCount[endpoint]) {
      this.rateLimitRetryCount[endpoint] = 0;
    }

    // Increment retry count
    this.rateLimitRetryCount[endpoint]++;

    // Exponential backoff with jitter: 2^retry * 100ms + random jitter
    const delay = Math.min(
      Math.pow(2, this.rateLimitRetryCount[endpoint]) * 100 +
        Math.random() * 100,
      10000 // Max 10 seconds
    );

    return delay;
  }

  private resetRetryCount(endpoint: string): void {
    this.rateLimitRetryCount[endpoint] = 0;
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

    const executeRequest = async (): Promise<T> => {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        try {
          const error = await response.json();
          console.log('yuda error ', error);

          // Handle rate limiting (429 Too Many Requests)
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const retryDelay = retryAfter
              ? parseInt(retryAfter) * 1000
              : this.getRetryDelay(endpoint);

            console.log(`Rate limited. Retrying in ${retryDelay / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));

            // Retry the request
            return executeRequest();
          }

          throw new Error(
            `Spotify API Error [${response.status}]: ${error.error.message}`
          );
        } catch (jsonErr) {
          // If there's an error parsing the error response
          if (response.status === 429) {
            const retryDelay = this.getRetryDelay(endpoint);
            console.log(`Rate limited. Retrying in ${retryDelay / 1000}s...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));

            // Retry the request
            return executeRequest();
          }

          throw new Error(`Spotify API Error [${response.status}]`);
        }
      }

      // Reset retry count on successful request
      this.resetRetryCount(endpoint);

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0') {
          // Empty response, return null for void methods
          return null as unknown as T;
        }

        try {
          // Parse the response JSON once and return it
          const data = await response.json();
          return data as T;
        } catch (jsonErr) {
          // For empty responses that don't set the content-length header
          if (method === 'PUT' || method === 'DELETE') {
            // These methods often return empty responses
            return null as unknown as T;
          }
          // Re-throw for other unexpected JSON parsing errors
          throw jsonErr;
        }
      } else {
        // Non-JSON response, return null
        return null as unknown as T;
      }
    };

    // Enqueue the request to manage concurrency
    return this.enqueueRequest(executeRequest);
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

  public getPlaylistItems = throttle(
    async (
      id: string,
      params?: {
        fields?: string;
        limit?: number;
        offset?: number;
        market?: string;
      },
      url?: string
    ): Promise<Spotify.PlaylistTrackResponse> =>
      this.request(url ? url : `playlists/${id}/tracks`, params),
    1500
  );

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
  // Library Endpoints
  // ======================

  public checkSavedTracks = throttle(
    async (ids: string[]): Promise<boolean[]> =>
      this.request<boolean[]>('me/tracks/contains', { ids }),
    1000
  );

  public saveTrack = debounce(async (ids: string[]): Promise<void> => {
    await this.request<void>('me/tracks', undefined, 'PUT', { ids });
    return;
  }, 300);

  public removeSavedTrack = debounce(async (ids: string[]): Promise<void> => {
    await this.request<void>('me/tracks', undefined, 'DELETE', { ids });
    return;
  }, 300);

  // ======================
  // Player Endpoints
  // ======================

  public getPlaybackState = throttle(
    async (params?: { market?: string }): Promise<Spotify.PlayerState> =>
      this.request('me/player', params),
    1000
  );

  public transferPlayback = async (
    deviceIds: string[],
    play?: boolean
  ): Promise<void> =>
    this.request('me/player', undefined, 'PUT', {
      device_ids: deviceIds,
      play,
    });

  public getAvailableDevices = throttle(
    async (): Promise<{
      devices: Spotify.Device[];
    }> => this.request('me/player/devices'),
    2000
  );

  public getCurrentlyPlayingTrack = throttle(
    async (params?: { market?: string }): Promise<Spotify.CurrentlyPlaying> =>
      this.request('me/player/currently-playing', params),
    1000
  );

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

  public getQueue = throttle(
    async (): Promise<{
      queue: Spotify.Track[];
      currently_playing: Spotify.Track;
    }> => this.request('me/player/queue'),
    1500
  );

  public getAlbumTracks = async (
    id: string,
    params?: { limit?: number; offset?: number; market?: string }
  ): Promise<Spotify.PagingObject<Spotify.Track>> =>
    this.request(`albums/${id}/tracks`, params);

  public getCurrentUserProfile = throttle(
    async (): Promise<Spotify.User> => this.request('me'),
    2000
  );

  public getSavedTracks = throttle(
    async (params?: {
      limit?: number;
      offset?: number;
      market?: string;
    }): Promise<Spotify.PagingObject<Spotify.SavedTrack>> =>
      this.request('me/tracks', params),
    1500
  );

  public getCurrentUserPlaylists = throttle(
    async (params?: {
      limit?: number;
      offset?: number;
    }): Promise<Spotify.PagingObject<Spotify.Playlist>> =>
      this.request('me/playlists', params),
    1500
  );

  public reorderPlaylistItems = async (
    playlistId: string,
    params: {
      range_start: number;
      range_length: number;
      insert_before: number;
    }
  ): Promise<Spotify.PlaylistSnapshotResponse> =>
    this.request(`playlists/${playlistId}/tracks`, undefined, 'PUT', params);
}

export const spotifyClient = SpotifyClient.getInstance();
