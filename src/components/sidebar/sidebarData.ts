import React, { JSX } from "react";
import { AiFillHome, AiOutlineAppstore, AiOutlineStar } from "react-icons/ai";
import {
  BiMusic,
  BiTime,
  BiFolder,
  BiPodcast,
  BiBookmark,
} from "react-icons/bi";
import { IconType } from "react-icons/lib";
import { TbPlaylistAdd } from "react-icons/tb";

// Define the type for navigation items
export type NavigationItem = {
  path: string;
  label: string;
  Icon: IconType; // Use ComponentType to represent React components
};

// Navigation items
export const navigationItems: NavigationItem[] = [
  { path: "/", label: "Home", Icon: AiFillHome },
  { path: "/new", label: "New", Icon: AiOutlineAppstore },
];

export const libraryItems: NavigationItem[] = [
  { path: "/songs", label: "Songs", Icon: BiMusic },
  { path: "/recently-added", label: "Recently Added", Icon: BiTime },
  { path: "/albums", label: "Albums", Icon: BiFolder },
  { path: "/favorite-songs", label: "Favorite Songs", Icon: AiOutlineStar },
  { path: "/all-playlists", label: "All Playlists", Icon: TbPlaylistAdd },
];

export const podcastItems: NavigationItem[] = [
  { path: "/podcasts/new", label: "New", Icon: BiPodcast },
  { path: "/browse", label: "Browse", Icon: BiPodcast },
  { path: "/shows", label: "Shows", Icon: BiPodcast },
  { path: "/saved", label: "Saved", Icon: BiBookmark },
  { path: "/repeated-hearing", label: "Repeated Hearing", Icon: BiTime },
];
