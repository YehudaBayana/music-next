import React from 'react';
import { Track } from '@/utils/types';
import TrackItem from '../../../../../components/TrackItem';

const PlaylistTracks = ({
  tracks,
  isLoading,
  playlistId,
}: {
  tracks: Track[];
  isLoading: boolean;
  playlistId: string;
}) => {
  return (
    <div className='mt-4'>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tracks
          .slice(0, 5)
          .map((track, index) => (
            <TrackItem
              context='playlist'
              key={index}
              track={track}
              playlistId={playlistId}
            />
          ))
      )}
    </div>
  );
};

export default PlaylistTracks;
