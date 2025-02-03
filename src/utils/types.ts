export type SearchType = 'track' | 'playlist' | 'podcast' | 'show' | 'artist';

export interface GetAlbumsResponse {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: AlbumsItems[];
}

export interface AlbumsItems {
  added_at: string;
  album: Album;
}

export interface Album {
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

export interface ExternalIds {
  isrc: string;
  ean: string;
  upc: string;
}

export interface Copyright {
  text: string;
  type: string;
}

export interface Tracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: Track[];
}

export interface AlbumTracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: AlbumTracks[];
}

// export interface AlbumTracksItem {
//   artists: Artist[];
//   available_markets: string[];
//   disc_number: number;
//   duration_ms: number;
//   explicit: boolean;
//   external_urls: ExternalUrls;
//   href: string;
//   id: string;
//   is_playable: boolean;
//   linked_from: Linkedfrom;
//   restrictions: Restrictions;
//   name: string;
//   preview_url: string;
//   track_number: number;
//   type: string;
//   uri: string;
//   is_local: boolean;
// }

export interface Linkedfrom {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: any[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

export interface Restrictions {
  reason: string;
}

// export interface AlbumImage {
//   url: string;
//   height: number;
//   width: number;
// }

// -------------- my playlists -------------
export interface GetMyPlaylistsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: MyPlaylistItem[];
}

export interface MyPlaylistItem {
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

export interface ExternalUrls {
  spotify: string;
}

export interface Image {
  height?: number;
  url: string;
  width?: number;
}

export interface MyPlaylistOwner {
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface MyPlaylistTracks {
  href: string;
  total: number;
}

// me profile
export interface MeResponse {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: unknown[];
  product: string;
  type: string;
  uri: string;
}

interface Followers {
  href?: unknown;
  total: number;
}

interface ExplicitContent {
  filter_enabled: boolean;
  filter_locked: boolean;
}

// ----- get playlist tracks response

export interface GetPlaylistTracksRes {
  href: string;
  items: Item[];
  limit: number;
  next?: string | null;
  offset: number;
  previous?: string | null;
  total: number;
}

export interface Item {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color?: unknown;
  track: Track;
  video_thumbnail: VideoThumbnail;
}

export interface VideoThumbnail {
  url?: unknown;
}

export interface Track {
  preview_url?: unknown;
  available_markets: string[];
  explicit: boolean;
  type: string;
  episode: boolean;
  track: boolean;
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

export interface ExternalIdsPlaylistTrack {
  isrc: string;
}

export interface AddedBy {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

// gpt start
export type PlaylistWithTracks = MyPlaylistItem & {
  ActualTracks: Track[];
};
// gpt end

// get current playing track
export interface GetCurrentlyPlayingTrackResponse {
  timestamp: number;
  context: Context;
  progress_ms: number;
  item: Track;
  currently_playing_type: string;
  actions: Actions;
  is_playing: boolean;
}

export interface Context {
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

// export interface ExternalUrls {
//   spotify: string
// }

// export interface Item {
//   album: Album;
//   artists: Artist[];
//   available_markets: string[];
//   disc_number: number;
//   duration_ms: number;
//   explicit: boolean;
//   external_ids: ExternalIds;
//   external_urls: ExternalUrls;
//   href: string;
//   id: string;
//   is_local: boolean;
//   name: string;
//   popularity: number;
//   preview_url: any;
//   track_number: number;
//   type: string;
//   uri: string;
// }

// export interface Album {
//   album_type: string
//   artists: Artist[]
//   available_markets: string[]
//   external_urls: ExternalUrls3
//   href: string
//   id: string
//   images: Image[]
//   name: string
//   release_date: string
//   release_date_precision: string
//   total_tracks: number
//   type: string
//   uri: string
// }

// export interface Artist {
//   external_urls: ExternalUrls2
//   href: string
//   id: string
//   name: string
//   type: string
//   uri: string
// }

// export interface ExternalUrls2 {
//   spotify: string
// }

// export interface ExternalUrls3 {
//   spotify: string
// }

// export interface Artist2 {
//   external_urls: ExternalUrls4
//   href: string
//   id: string
//   name: string
//   type: string
//   uri: string
// }

// export interface ExternalUrls4 {
//   spotify: string
// }

// export interface ExternalIds {
//   isrc: string
// }

// export interface ExternalUrls5 {
//   spotify: string
// }

export interface Actions {
  disallows: Disallows;
}

export interface Disallows {
  resuming: boolean;
}

// ------------------------
export interface Device {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  supports_volume: boolean;
  type: string;
  volume_percent: number;
}
// ------------------------
export interface CurrentlyPlayingTrack {
  timestamp: number;
  context: unknown;
  progress_ms: number;
  item: Item;
  currently_playing_type: string;
  actions: Actions;
  is_playing: boolean;
}
// ------------------------
export interface PlayerState {
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

export interface Context {
  uri: string;
  metadata: unknown;
}

export interface PlaybackFeatures {
  hifi_status: string;
  playback_speed: PlaybackSpeed;
  signal_ids: unknown[];
  modes: unknown;
}

export interface PlaybackSpeed {
  current: number;
  selected: number;
  restricted: boolean;
}

export interface TrackWindow {
  current_track: CurrentTrack;
  next_tracks: unknown[];
  previous_tracks: unknown[];
}

export interface CurrentTrack {
  id: string;
  uri: string;
  type: string;
  uid: string;
  linked_from: LinkedFrom;
  media_type: string;
  track_type: string;
  content_type: string;
  name: string;
  duration_ms: number;
  artists: ArtistPlayerState[];
  album: AlbumPlayerState;
  is_playable: boolean;
  metadata: unknown;
}

export interface LinkedFrom {
  uri: unknown;
  id: unknown;
}

export interface ArtistPlayerState {
  name: string;
  uri: string;
}

export interface AlbumPlayerState {
  uri: string;
  name: string;
  images: Image[];
}

export interface Restrictions {
  disallow_skipping_prev_reasons: string[];
  disallow_setting_playback_speed_reasons: string[];
  disallow_removing_from_next_tracks_reasons: unknown[];
  disallow_removing_from_context_tracks_reasons: unknown[];
  disallow_updating_context_reasons: unknown[];
  disallow_play_as_next_in_queue_reasons: unknown[];
  disallow_resuming_reasons: string[];
}

export interface Disallows {
  skipping_prev: boolean;
  setting_playback_speed: boolean;
  removing_from_next_tracks: boolean;
  removing_from_context_tracks: boolean;
  updating_context: boolean;
  play_as_next_in_queue: boolean;
  resuming: boolean;
}

// ------------------------
export interface Artists {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: any;
  total: number;
  items: Artist[];
}
export interface Albums {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: any;
  total: number;
  items: Album[];
}

export interface Playlists {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: any;
  total: number;
  items: MyPlaylistItem[];
}
export interface SearchSpotifyResponse {
  tracks: Tracks;
  artists: Artists;
  albums: Albums;
  playlists: Playlists;
  // shows: Shows
  // episodes: Episodes
  // audiobooks: Audiobooks
}
// ------------------------

export interface AlbumTracks {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  preview_url: any;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}
export interface GetAlbumRes {
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
  type: string;
  uri: string;
  artists: Artist[];
  tracks: Tracks;
  copyrights: Copyright[];
  external_ids: ExternalIds;
  genres: any[];
  label: string;
  popularity: number;
}

// ------------------------
