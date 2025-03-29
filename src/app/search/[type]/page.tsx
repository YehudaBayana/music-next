'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { searchSpotify } from '@/utils/spotifyApi';
import TrackItem from '@/components/trackItem/TrackItem';
import Album from '@/components/albums/Album';
import Playlist from '@/components/playlists/Playlist';
import Artist from '@/components/artists/Artist';

const validTypes = ['track', 'album', 'artist', 'playlist'] as const;

const SearchByType = () => {
  const params = useParams();
  const type = params?.type as
    | 'track'
    | 'album'
    | 'artist'
    | 'playlist'
    | undefined;
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

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

        if (validTypes.includes(type)) {
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
    <div>
      <h1 className='text-3xl font-bold mb-6'>
        Showing {type} results for {query}
      </h1>
      {type === 'track' && (
        <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {results.map((track) => (
            <TrackItem track={track} key={track.id} />
          ))}
        </div>
      )}
      {type === 'album' && (
        <div className='flex gap-x-10 flex-wrap justify-start'>
          {results.map((album) => (
            <Album album={album} key={album.id} />
          ))}
        </div>
      )}
      {type === 'playlist' && (
        <div className='flex gap-x-10 flex-wrap justify-start'>
          {results.map((playlist) => (
            <Playlist playlist={playlist} key={playlist.id} />
          ))}
        </div>
      )}
      {type === 'artist' && (
        <div className='flex gap-x-10 flex-wrap justify-start'>
          {results.map((artist) => (
            <Artist artist={artist} key={artist.id} />
          ))}
        </div>
      )}
    </div>
  );
};
const SearchByTypePage = () => {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchByType />
    </Suspense>
  );
};

export default SearchByTypePage;
