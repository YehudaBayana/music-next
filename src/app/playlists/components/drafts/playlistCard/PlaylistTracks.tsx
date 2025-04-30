import React, { useState } from 'react';
import TrackItem from '../../../../../components/trackItem/TrackItem';

const PlaylistTracks = ({
  tracks,
  isLoading,
}: // playlistId,
{
  tracks: (Spotify.Track | Spotify.Episode)[];
  isLoading: boolean;
  // playlistId: string;
}) => {
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>([]);

  const handleTrackSelect = (trackId: string) => {
    setSelectedTrackIds((prev) =>
      prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handleBulkAction = (action: 'delete' | 'add-to-playlist') => {
    console.log(`Performing ${action} on:`, selectedTrackIds);
    // Implement your bulk action logic here
    setSelectedTrackIds([]); // Clear selection after action
  };
  return (
    <div className='mt-4'>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tracks.slice(0, 5).map((track, index) => (
          <TrackItem
            key={index}
            track={track}
            // context_uri={pla}
            isSelected={selectedTrackIds.includes(track.id)}
            onToggleSelect={() => handleTrackSelect(track.id)}
          />
        ))
      )}
      {/* Floating Action Menu */}
      {selectedTrackIds.length > 0 && (
        <div className='fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex gap-4 items-center'>
          <span className='text-gray-600 dark:text-gray-300'>
            {selectedTrackIds.length} selected
          </span>
          <button
            onClick={() => handleBulkAction('add-to-playlist')}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Add to Playlist
          </button>
          <button
            onClick={() => handleBulkAction('delete')}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Delete
          </button>
          <button
            onClick={() => setSelectedTrackIds([])}
            className='px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistTracks;
