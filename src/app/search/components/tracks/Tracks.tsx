import TrackItem from '@/app/my-playlists/playlistCard/TrackItem';
import { Track } from '@/utils/types';
import React from 'react';

const Tracks = ({
  tracks,
  handleSeeAll,
}: {
  tracks: Track[];
  handleSeeAll: (type: string) => void;
}) => {
  return (
    <section>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Tracks</h2>
        <button
          onClick={() => handleSeeAll('track')}
          className='text-green-500 hover:underline'
        >
          See All
        </button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tracks.map((track) => (
          <TrackItem track={track} key={track.id} />
        ))}
      </div>
    </section>
  );
};

export default Tracks;
