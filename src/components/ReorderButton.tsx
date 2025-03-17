'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { spotifyClient } from '@/api/spotifyClient';

interface PlaylistTrack {
  track: {
    uri: string;
  };
  added_at: string;
}

interface ReorderButtonProps {
  playlistId: string;
}

export default function ReorderButton({ playlistId }: ReorderButtonProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const fetchPaginatedTracks = async (url: string) => {
    const tracks: PlaylistTrack[] = [];
    while (url) {
      const data = await spotifyClient.getPlaylistItems(
        playlistId,
        undefined,
        url
      );
      tracks.push(...data.items);
      url = data.next;
    }
    return tracks;
  };

  const reorderTracks = async () => {
    if (!session) return;
    setIsLoading(true);

    try {
      // Fetch all tracks
      const initialUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`;
      const tracks = await fetchPaginatedTracks(initialUrl);

      // Sort tracks by added date (newest first)
      const sorted = [...tracks].sort(
        (a, b) =>
          new Date(b.added_at).getTime() - new Date(a.added_at).getTime()
      );

      // Create position maps
      const currentURIs = tracks.map((t) => t.track.uri);
      const sortedURIs = sorted.map((t) => t.track.uri);

      // Perform reordering from bottom to top
      for (let i = sorted.length - 1; i >= 0; i--) {
        const currentPos = currentURIs.indexOf(sortedURIs[i]);
        if (currentPos === i) continue;

        // Update playlist through Spotify API
        await fetch(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              range_start: currentPos,
              range_length: 1,
              insert_before: i,
            }),
          }
        );

        // Update local position tracking
        currentURIs.splice(currentPos, 1);
        currentURIs.splice(i, 0, sortedURIs[i]);
      }

      alert('Playlist reordered successfully!');
    } catch (error) {
      console.error('Reorder failed:', error);
      alert('Reorder failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={reorderTracks}
      disabled={isLoading}
      className='px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:bg-gray-400 transition-colors'
    >
      {isLoading ? 'Reordering...' : 'Sort by Date Added'}
    </button>
  );
}
