import TrackItem from '@/components/trackItem/TrackItem';
import { Track } from '@/utils/types';
import Link from 'next/link';
import React from 'react';

const Tracks = ({ tracks, path }: { tracks: Track[]; path: string }) => {
  return (
    <section>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Tracks</h2>
        <Link href={path}>
          <button
            // onClick={() => handleSeeAll('track')}
            className='text-green-500 hover:underline'
          >
            See All
          </button>
        </Link>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {tracks.map((track) => (
          <TrackItem context={null} track={track} key={track.id} />
        ))}
      </div>
    </section>
  );
};

export default Tracks;
