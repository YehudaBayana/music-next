export type SearchType = "track" | "playlist" | "podcast" | "show" | "artist";

export interface GetMyAlbumsResponse {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: AlbumItems[];
}

export interface AlbumItems {
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
  tracks: AlbumTracks;
  copyrights: Copyright[];
  external_ids: ExternalIds;
  genres: any[];
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

export interface AlbumTracks {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: AlbumTracksItem[];
}

export interface AlbumTracksItem {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from: Linkedfrom;
  restrictions: Restrictions;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

export interface Linkedfrom {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  type: string;
  uri: string;
}

export interface Artist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
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
  primary_color: any;
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
  images: any[];
  product: string;
  type: string;
  uri: string;
}

interface Followers {
  href?: any;
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
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface Item {
  added_at: string;
  added_by: AddedBy;
  is_local: boolean;
  primary_color?: any;
  track: Track;
  video_thumbnail: VideoThumbnail;
}

export interface VideoThumbnail {
  url?: any;
}

export interface Track {
  preview_url?: any;
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
