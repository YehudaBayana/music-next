// types/spotify.d.ts
declare namespace Spotify {
  interface Album {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists: Artist[];
    tracks: Tracks;
    copyrights: Copyright[];
    external_ids: ExternalIds;
    genres: unknown[];
    label: string;
    popularity: number;
  }

  interface PagingObject<T> {
    href: string;
    items: T[];
    limit: number;
    offset: number;
    total: number;
  }

  interface Image {
    url: string;
    height?: number;
    width?: number;
  }

  interface Track {
    preview_url?: unknown;
    available_markets: string[];
    explicit: boolean;
    type: 'track';
    // track: boolean;
    album: Album;
    artists: Artist[];
    disc_number: number;
    track_number: number;
    duration_ms: number;
    external_ids: ExternalIdsPlaylistTrack;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    popularity: number;
    uri: string;
    is_local: boolean;
  }
  interface Artist {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: unknown[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }

  interface AudioAnalysis {
    bars: TimeInterval[];
    beats: TimeInterval[];
    sections: Section[];
    segments: Segment[];
    tatums: TimeInterval[];
  }

  interface AudioFeatures {
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: number;
    speechiness: number;
    tempo: number;
    time_signature: number;
    valence: number;
  }

  interface TimeInterval {
    start: number;
    duration: number;
    confidence: number;
  }

  interface Section {
    start: number;
    duration: number;
    confidence: number;
    loudness: number;
    tempo: number;
    key: number;
    mode: number;
  }

  interface Segment {
    start: number;
    duration: number;
    confidence: number;
    pitches: number[];
    timbre: number[];
  }

  interface CurrentlyPlaying {
    timestamp: number;
    context: unknown;
    progress_ms: number;
    item: Track | null;
    currently_playing_type: 'episode' | 'track';
    actions: Actions;
    is_playing: boolean;
  }

  interface PlayerState {
    repeat_state: 'off' | 'track' | 'context';
    timestamp: number;
    context: Context;
    position: number;
    duration: number;
    paused: boolean;
    playback_quality: string;
    playback_features: PlaybackFeatures;
    shuffle: boolean;
    shuffle_mode: number;
    repeat_mode: number;
    track_window: TrackWindow;
    restrictions: Restrictions;
    disallows: Disallows;
    loading: boolean;
    playback_speed: number;
    playback_id: string;
  }

  interface TrackWindow {
    current_track: CurrentTrack;
    next_tracks: unknown[];
    previous_tracks: unknown[];
  }

  interface CurrentTrack {
    id: string;
    uri: string;
    type: 'track';
    uid: string;
    linked_from: LinkedFrom;
    media_type: string;
    track_type: string;
    name: string;
    duration_ms: number;
    artists: Artist[];
    album: Album;
    is_playable: boolean;
  }

  interface Device {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  }

  interface Context {
    type: 'artist' | 'playlist' | 'album' | 'show';
    href: string;
    external_urls: ExternalUrls;
    uri: string;
  }

  interface ExternalUrls {
    spotify: string;
  }

  interface Playlist {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: MyPlaylistOwner;
    primary_color: unknown;
    public: boolean;
    snapshot_id: string;
    tracks: MyPlaylistTracks;
    type: string;
    uri: string;
  }

  interface PlaylistTrackResponse {
    href: string;
    items: Array<{
      added_at: string;
      added_by: User;
      is_local: boolean;
      track: Track | Episode;
    }>;
    limit: number;
    offset: number;
    total: number;
    next: any;
    previous: any;
  }

  interface PlaylistSnapshotResponse {
    snapshot_id: string;
  }

  interface FeaturedPlaylists {
    message: string;
    playlists: PagingObject<Playlist>;
  }

  interface Category {
    id: string;
    name: string;
    icons: Image[];
  }

  interface Recommendations {
    seeds: RecommendationSeed[];
    tracks: Track[];
  }

  interface RecommendationSeed {
    afterFilteringSize: number;
    afterRelinkingSize: number;
    href: string;
    id: string;
    initialPoolSize: number;
    type: 'artist' | 'track' | 'genre';
  }

  interface Show {
    id: string;
    name: string;
    publisher: string;
    description: string;
    episodes: PagingObject<Episode>;
    images: Image[];
  }

  interface Episode {
    id: string;
    name: string;
    description: string;
    duration_ms: number;
    release_date: string;
    images: Image[];
    audio_preview_url: string | null;
    uri: string;
    type: 'episode';
  }

  interface User {
    country: string;
    display_name: string;
    email: string;
    explicit_content: ExplicitContent;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: any[];
    product: string;
    type: string;
    uri: string;
  }

  interface Followers {
    href: any;
    total: number;
  }

  interface ExplicitContent {
    filter_enabled: boolean;
    filter_locked: boolean;
  }

  interface SavedTrack {
    added_at: string;
    track: Track;
  }

  interface SavedAlbum {
    added_at: string;
    album: Album;
  }

  interface SavedEpisode {
    added_at: string;
    episode: Episode;
  }

  interface SavedShow {
    added_at: string;
    show: Show;
  }

  interface CursorBasedPaging<T> {
    href: string;
    items: T[];
    limit: number;
    next: string | null;
    cursors: {
      after?: string;
      before?: string;
    };
    total: number;
  }

  interface PlayHistory {
    track: Track;
    played_at: string;
    context: Context;
  }

  interface SearchResult {
    tracks?: PagingObject<Track>;
    albums?: PagingObject<Album>;
    artists?: PagingObject<Artist>;
    playlists?: PagingObject<Playlist>;
    shows?: PagingObject<Show>;
    episodes?: PagingObject<Episode>;
  }

  interface Chapter {
    id: string;
    name: string;
    description: string;
    duration_ms: number;
    audio_preview_url: string | null;
    images: Image[];
  }
}
