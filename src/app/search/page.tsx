'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Album, Artist, MyPlaylistItem, Track } from '@/utils/types';
import { searchSpotify } from '@/utils/spotifyApi';
import Tracks from '@/components/tracks/Tracks';
import Albums from '@/components/albums/Albums';
import Playlists from '@/components/playlists/Playlists';
import { PATHS } from '@/components/sidebar/sidebarData';

const SearchResults = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';

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

  return (
    <div>
      <h1 className='text-3xl font-bold mb-6'>Search Results for {query}</h1>
      {results.tracks.length > 0 && (
        <Tracks
          tracks={results.tracks}
          path={`${PATHS.search}/track?query=${encodeURIComponent(query)}`}
        />
      )}
      {results.albums.length > 0 && (
        <Albums
          albums={results.albums}
          path={`${PATHS.search}/album?query=${encodeURIComponent(query)}`}
        />
      )}
      {/* {results.artists.length > 0 && (
        <Artists
          artists={results.artists}
          path={`${PATHS.search}/artist?query=${encodeURIComponent(query)}`}
        />
      )} */}
      {results.playlists.length > 0 && (
        <Playlists
          playlists={results.playlists}
          path={`${PATHS.search}/playlist?query=${encodeURIComponent(query)}`}
        />
      )}
    </div>
  );
};

const SearchResultsPage = () => {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResults />
    </Suspense>
  );
};

export default SearchResultsPage;
