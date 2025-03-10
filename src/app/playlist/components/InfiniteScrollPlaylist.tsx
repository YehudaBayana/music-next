'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MyPlaylistItem } from '@/utils/types';
import TrackItem from '@/components/trackItem/TrackItem';
import uniqBy from 'lodash/uniqBy';
import BulkActionsBar from '@/components/bulkActionsBar/BulkActionsBar';
import { getPlaylistItems } from '@/api/spotify';

const InfiniteScrollPlaylist = ({
  playlist,
  initialTracks,
}: {
  playlist: MyPlaylistItem;
  initialTracks: (Spotify.Track | Spotify.Episode)[];
}) => {
  const [tracks, setTracks] =
    useState<(Spotify.Track | Spotify.Episode)[]>(initialTracks);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialTracks.length);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTrackUris, setSelectedTrackUris] = useState<string[]>([]);
  const [lastSelectedUri, setLastSelectedUri] = useState<string | null>(null);

  const handleTracksDeleted = (deletedTrackUris: string[]) => {
    setTracks((prevTracks) =>
      prevTracks.filter((track) => !deletedTrackUris.includes(track.uri))
    );
  };

  const fetchMoreTracks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const {
        newTracks,
        hasMoreServer,
      }: {
        newTracks: (Spotify.Track | Spotify.Episode)[];
        hasMoreServer: boolean;
      } = await getPlaylistItems(playlist.id, { offset });

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
  }, [playlist, offset, hasMore, loading]);

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
      <BulkActionsBar
        selectedTrackUris={selectedTrackUris}
        setSelectedTrackUris={setSelectedTrackUris}
        contextId={playlist.id}
        contextType='playlist'
        onTracksDeleted={handleTracksDeleted} // ✅ Pass the new function
      />
    </div>
  );
};

export default InfiniteScrollPlaylist;
