'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Album, Artist, MyPlaylistItem, Track } from '@/utils/types';
import { searchSpotify } from '@/utils/spotifyApi';
import Tracks from '@/app/search/components/tracks/Tracks';
import Albums from '@/app/search/components/albums/Albums';
import Artists from '@/app/search/components/artists/Artists';
import Playlists from '@/app/search/components/playlists/Playlists';
import { PATHS } from '@/components/sidebar/sidebarData';

const SearchResults = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';
  const router = useRouter();

  const [results, setResults] = useState<{
    tracks: Track[];
    albums: Album[];
    artists: Artist[];
    playlists: MyPlaylistItem[];
  }>({
    tracks: [],
    albums: [],
    artists: [],
    playlists: [],
  });

  useEffect(() => {
    if (!query || !accessToken) return;

    const fetchSearchResults = async () => {
      try {
        const response = await searchSpotify(
          query,
          accessToken,
          'track,album,artist,playlist',
          0,
          6
        ); // Show limited results
        setResults({
          tracks: response?.tracks?.items.filter((item) => item) || [],
          albums: response?.albums?.items.filter((item) => item) || [],
          artists: response?.artists?.items.filter((item) => item) || [],
          playlists: response?.playlists?.items.filter((item) => item) || [],
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();
  }, [query, accessToken]);

  // Navigate to "See All" page for a specific type
  const handleSeeAll = (type: string) => {
    router.push(`/search/${type}?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Search Results for "{query}"</h1>
      {results.tracks.length > 0 && (
        <Tracks
          tracks={results.tracks}
          path={`/${PATHS.search}/track?query=${encodeURIComponent(query)}`}
        />
      )}
      {results.albums.length > 0 && (
        <Albums
          albums={results.albums}
          path={`/${PATHS.search}/track?query=${encodeURIComponent(query)}`}
        />
      )}
      {results.artists.length > 0 && (
        <Artists
          artists={results.artists}
          path={`/${PATHS.search}/track?query=${encodeURIComponent(query)}`}
        />
      )}
      {results.playlists.length > 0 && (
        <Playlists
          playlists={results.playlists}
          path={`/${PATHS.search}/track?query=${encodeURIComponent(query)}`}
        />
      )}
    </div>
  );
};

export default SearchResults;
