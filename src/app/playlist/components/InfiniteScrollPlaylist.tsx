'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import DraggableTrackItem from '@/components/trackItem/DraggableTrackItem';
import DroppablePlaylist from '@/components/playlists/DroppablePlaylist';
import { DragDropContext } from '@hello-pangea/dnd';
import uniqBy from 'lodash/uniqBy';
import BulkActionsBar from '@/components/bulkActionsBar/BulkActionsBar';
import { spotifyClient } from '@/api/spotifyClient';
import { PlaylistDropResult, ReorderTracksParams } from '@/types/dragAndDrop';

const InfiniteScrollPlaylist = ({
  playlist,
  initialTracks,
}: {
  playlist: Spotify.Playlist;
  initialTracks: (Spotify.Track | Spotify.Episode)[];
}) => {
  const { data: session } = useSession();
  const [isPlaylistOwner, setIsPlaylistOwner] = useState(false);
  const [tracks, setTracks] =
    useState<(Spotify.Track | Spotify.Episode)[]>(initialTracks);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialTracks.length);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTrackUris, setSelectedTrackUris] = useState<string[]>([]);
  const [lastSelectedUri, setLastSelectedUri] = useState<string | null>(null);

  const onTracksDeleted = (deletedTrackUris: string[]) => {
    setTracks((prevTracks) =>
      prevTracks.filter((track) => !deletedTrackUris.includes(track.uri))
    );
  };

  const fetchMoreTracks = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await spotifyClient.getPlaylistItems(playlist.id, { offset });
      const newTracks = res.items.map((item) => item.track);
      const hasMoreServer = newTracks.length > 0;

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
  }, [loading, hasMore, playlist.id, offset]);

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

  // Check if current user is the playlist owner using Spotify API
  useEffect(() => {
    // Skip API call if we don't have necessary data
    if (!session?.accessToken || !playlist?.owner?.id) {
      setIsPlaylistOwner(false);
      return;
    }

    // Store a flag to prevent state updates if component unmounts
    let isMounted = true;

    const checkPlaylistOwnership = async () => {
      try {
        const currentUser = await spotifyClient.getCurrentUserProfile();
        // Only update state if component is still mounted
        if (isMounted) {
          // Compare user ID with playlist owner's ID for reliable ownership check
          setIsPlaylistOwner(currentUser.id === playlist.owner.id);
        }
      } catch (error) {
        console.error('Error checking playlist ownership:', error);
        // If we hit a rate limit error, don't update state to prevent re-renders
        if (isMounted && !String(error).includes('429')) {
          setIsPlaylistOwner(false);
        }
      }
    };

    checkPlaylistOwnership();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [session?.accessToken, playlist?.owner?.id]); // Only re-run when these specific props change

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

  const handleDragEnd = useCallback(
    async (result: PlaylistDropResult) => {
      console.log('handleDragEnd called with result:', result);
      const { source, destination } = result;

      // Dropped outside the list or no movement
      if (
        !destination ||
        (source.droppableId === destination.droppableId &&
          source.index === destination.index)
      ) {
        console.log('Drag operation cancelled or no movement detected');
        return;
      }

      // Update the local state for immediate UI feedback
      const newTracks = Array.from(tracks);
      const [removed] = newTracks.splice(source.index, 1);
      newTracks.splice(destination.index, 0, removed);
      setTracks(newTracks);

      // Prepare parameters for the Spotify API
      const params: ReorderTracksParams = {
        range_start: source.index,
        range_length: 1,
        insert_before:
          destination.index > source.index
            ? destination.index + 1
            : destination.index,
      };

      try {
        console.log(
          'Calling Spotify API to reorder tracks with params:',
          params
        );
        // Call Spotify API to update the playlist
        await spotifyClient.reorderPlaylistItems(playlist.id, params);
        console.log('Successfully reordered tracks in playlist');
      } catch (error) {
        console.error('Error reordering tracks:', error);
        // Revert to original order on error
        setTracks(tracks);
      }
    },
    [tracks, playlist.id]
  );

  // Using type assertion to work around React 19 compatibility issues with react-beautiful-dnd
  const DragDropContextComponent = DragDropContext as any;

  return (
    <DragDropContextComponent onDragEnd={handleDragEnd}>
      <div className=''>
        <DroppablePlaylist droppableId={playlist.id}>
          {uniqBy(tracks, 'id').map((track, index) => (
            <DraggableTrackItem
              onTracksDeleted={onTracksDeleted}
              context={playlist}
              key={track.uri}
              track={track}
              index={index}
              isSelected={selectedTrackUris.includes(track.uri)}
              onToggleSelect={(e: React.MouseEvent) =>
                handleTrackSelect(track.uri, e)
              }
              dragHandleProps={isPlaylistOwner}
            />
          ))}
        </DroppablePlaylist>
        {loading && <p>Loading more tracks...</p>}
        {/* Floating Action Menu */}
        <BulkActionsBar
          selectedTrackUris={selectedTrackUris}
          setSelectedTrackUris={setSelectedTrackUris}
          context={playlist}
          onTracksDeleted={onTracksDeleted} // ✅ Pass the new function
        />
      </div>
    </DragDropContextComponent>
  );
};

export default InfiniteScrollPlaylist;
