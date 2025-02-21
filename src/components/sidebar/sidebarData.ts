import { AiFillHome, AiOutlineAppstore, AiOutlineStar } from 'react-icons/ai';
import {
  BiMusic,
  BiTime,
  BiFolder,
  BiPodcast,
  BiBookmark,
} from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
import { TbPlaylistAdd } from 'react-icons/tb';

// Define the type for navigation items
export type NavigationItem = {
  path: string;
  label: string;
  Icon: IconType; // Use ComponentType to represent React components
};

// Centralized Paths Object
export const PATHS = {
  home: '/',
  new: '/new',
  playlist: '/playlist',
  songs: '/songs',
  recentlyAdded: '/recently-added',
  albums: '/albums',
  album: '/album',
  favoriteSongs: '/favorite-songs',
  myPlaylists: '/playlists',
  podcasts: {
    new: '/podcasts/new',
    browse: '/browse',
    shows: '/shows',
    saved: '/saved',
    repeatedHearing: '/repeated-hearing',
  },
  search: '/search',
  artist: '/artist',
};

// Navigation Items
export const navigationItems: NavigationItem[] = [
  { path: PATHS.home, label: 'Home', Icon: AiFillHome },
  // { path: PATHS.new, label: 'New', Icon: AiOutlineAppstore },
];

export const libraryItems: NavigationItem[] = [
  // { path: PATHS.songs, label: 'Songs', Icon: BiMusic },
  // { path: PATHS.recentlyAdded, label: 'Recently Added', Icon: BiTime },
  { path: PATHS.albums, label: 'Albums', Icon: BiFolder },
  // { path: PATHS.favoriteSongs, label: 'Favorite Songs', Icon: AiOutlineStar },
  { path: PATHS.myPlaylists, label: 'All Playlists', Icon: TbPlaylistAdd },
];

export const podcastItems: NavigationItem[] = [
  // { path: PATHS.podcasts.new, label: 'New', Icon: BiPodcast },
  // { path: PATHS.podcasts.browse, label: 'Browse', Icon: BiPodcast },
  // { path: PATHS.podcasts.shows, label: 'Shows', Icon: BiPodcast },
  // { path: PATHS.podcasts.saved, label: 'Saved', Icon: BiBookmark },
  // {
  //   path: PATHS.podcasts.repeatedHearing,
  //   label: 'Repeated Hearing',
  //   Icon: BiTime,
  // },
];
