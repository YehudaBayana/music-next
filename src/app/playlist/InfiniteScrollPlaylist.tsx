"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Track } from "@/utils/types";
import TrackItem from "@/app/my-playlists/playlistCard/TrackItem";
import uniqBy from "lodash/uniqBy";

const InfiniteScrollPlaylist = ({
  playlistId,
  accessToken,
  initialTracks,
}: {
  playlistId: string;
  accessToken: string;
  initialTracks: Track[];
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialTracks.length);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreTracks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/spotify/playlist/playlist-tracks?playlistId=${playlistId}&offset=${offset}`
      );
      const {
        newTracks,
        hasMoreServer,
      }: { newTracks: Track[]; hasMoreServer: boolean } = await res.json();

      if (hasMoreServer) {
        setTracks((prev) => uniqBy([...prev, ...newTracks], "id"));
        setOffset((prev) => prev + newTracks.length);
      } else {
        setHasMore(hasMoreServer);
      }
    } catch (err) {
      console.error("Error loading more tracks:", err);
    } finally {
      setLoading(false);
    }
  }, [playlistId, accessToken, offset, hasMore, loading]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchMoreTracks();
    }
  }, [fetchMoreTracks]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div>
      {uniqBy(tracks, "id").map((track) => (
        <TrackItem key={track.id} track={track} playlistId={playlistId} />
      ))}
      {loading && <p>Loading more tracks...</p>}
    </div>
  );
};

export default InfiniteScrollPlaylist;
