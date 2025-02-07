'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Track } from '@/utils/types';
import { searchSpotify } from '@/utils/spotifyApi';
import TrackItem from '@/components/TrackItem';

const SearchBar = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!debouncedQuery || !accessToken) {
      setTracks([]);
      return;
    }

    const fetchTracks = async () => {
      try {
        const response = await searchSpotify(
          debouncedQuery,
          accessToken,
          'track',
          0,
          5
        );
        setTracks(response?.tracks?.items || []);
        if (response) {
          setIsOpen(response?.tracks?.items.length > 0);
        }
      } catch (error) {
        console.error('Error fetching tracks:', error);
        setTracks([]);
      }
    };

    fetchTracks();
  }, [debouncedQuery, accessToken]);

  // Handle Enter key press
  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className='relative w-1/4 hidden sm:block' ref={searchRef}>
      <input
        type='text'
        placeholder='Search...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearchSubmit} // Capture "Enter" key press
        className='w-full p-3 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring focus:ring-green-400'
      />

      {isOpen && (
        <div className='p-2 absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-50'>
          {tracks.map((track) => (
            // <Link
            //   key={track.id}
            //   href={track.external_urls.spotify}
            //   target='_blank'
            //   className='flex items-center gap-3 p-3 hover:bg-gray-100 transition'
            // >
            <TrackItem dropImage dropContext track={track} key={track.id} />
            // </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
