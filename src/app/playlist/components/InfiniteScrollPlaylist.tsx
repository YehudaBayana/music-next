'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MyPlaylistItem, Track } from '@/utils/types';
import TrackItem from '@/components/trackItem/TrackItem';
import uniqBy from 'lodash/uniqBy';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';
import FloatingSelected from '@/components/floatingSelected/FloatingSelected';

const InfiniteScrollPlaylist = ({
  playlist,
  accessToken,
  initialTracks,
}: {
  playlist: MyPlaylistItem;
  accessToken: string;
  initialTracks: Track[];
}) => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialTracks.length);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTrackUris, setSelectedTrackUris] = useState<string[]>([]);
  const [lastSelectedUri, setLastSelectedUri] = useState<string | null>(null);

  const fetchMoreTracks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const {
        newTracks,
        hasMoreServer,
      }: { newTracks: Track[]; hasMoreServer: boolean } =
        await getPlaylistTracks(playlist.id, accessToken, offset);

      if (hasMoreServer) {
        setTracks((prev) => uniqBy([...prev, ...newTracks], 'id'));
        setOffset((prev) => prev + newTracks.length);
      } else {
        setHasMore(hasMoreServer);
      }
    } catch (err) {
      console.error('Error loading more tracks:', err);
    } finally {
      setLoading(false);
    }
  }, [playlist, accessToken, offset, hasMore, loading]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchMoreTracks();
    }
  }, [fetchMoreTracks]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTrackUris([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleTrackSelect = (trackUri: string, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedUri) {
      // Find indices of last selected and current track
      const lastIndex = tracks.findIndex((t) => t.uri === lastSelectedUri);
      const currentIndex = tracks.findIndex((t) => t.uri === trackUri);

      if (lastIndex === -1 || currentIndex === -1) return;

      // Create range from indices
      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeUris = tracks.slice(start, end + 1).map((t) => t.uri);

      // Merge with existing selection
      setSelectedTrackUris((prev) => [...new Set([...prev, ...rangeUris])]);
    } else {
      // Normal toggle selection
      setSelectedTrackUris((prev) =>
        prev.includes(trackUri)
          ? prev.filter((id) => id !== trackUri)
          : [...prev, trackUri]
      );
    }

    // Always update last selected ID
    setLastSelectedUri(trackUri);
  };

  return (
    <div className='px-6'>
      {uniqBy(tracks, 'id').map((track) => (
        <TrackItem
          context='playlist'
          key={track.uri}
          track={track}
          playlistId={playlist.id}
          isSelected={selectedTrackUris.includes(track.uri)}
          onToggleSelect={(e: React.MouseEvent) =>
            handleTrackSelect(track.uri, e)
          }
        />
      ))}
      {loading && <p>Loading more tracks...</p>}
      {/* Floating Action Menu */}
      <FloatingSelected
        selectedTrackUris={selectedTrackUris}
        setSelectedTrackUris={setSelectedTrackUris}
        contextId={playlist.id}
        contextType='playlist'
      />
    </div>
  );
};

export default InfiniteScrollPlaylist;
