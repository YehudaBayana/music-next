'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { searchSpotify } from '@/utils/spotifyApi';
import TrackItem from '@/app/my-playlists/playlistCard/TrackItem';

const SearchByTypePage = () => {
  const params = useParams();
  const type = params?.type as string | undefined;
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  //   console.log('type ', type);

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query || !accessToken || !type) return;

    const fetchResults = async () => {
      try {
        const response = await searchSpotify(
          query,
          accessToken,
          type as string,
          0,
          20
        );

        const validTypes = ['track', 'album', 'artist', 'playlist'] as const;
        if (validTypes.includes(type as any)) {
          setResults(
            (response as any)[type + 's']?.items.filter(
              (item: unknown) => item
            ) || []
          );
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, [query, accessToken, type]);

  return (
    <div className='max-w-6xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>
        Showing {type} results for "{query}"
      </h1>
      <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {type === 'track' &&
          results.map((track) => <TrackItem track={track} key={track.id} />)}
        {/* {results.map((item) => (
          <div
            key={item.id}
            className='p-4 border rounded-lg shadow hover:bg-gray-100 transition'
          >
            <img
              src={item.images?.[0]?.url || item.album?.images?.[0]?.url}
              alt={item.name}
              className='w-full h-40 object-cover rounded-md'
            />
            <h3 className='font-medium mt-2'>{item.name}</h3>
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default SearchByTypePage;
