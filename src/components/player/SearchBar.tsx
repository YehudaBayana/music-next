'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TrackItem from '@/components/trackItem/TrackItem';
import { spotifyClient } from '@/api/spotifyClient';

const SearchBar = () => {
  const { data: session } = useSession();
  const accessToken = session?.accessToken;
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Spotify.Track[]>([]);
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
    if (!query) {
      setIsOpen(false);
    }
    return () => {};
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery || !accessToken) {
      setTracks([]);
      return;
    }

    const fetchTracks = async () => {
      try {
        const response = await spotifyClient.search(debouncedQuery, ['track'], {
          offset: 0,
          limit: 5,
        });
        setTracks(response?.tracks?.items || []);
        if (response) {
          setIsOpen(!!response?.tracks?.items?.length);
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
        className='w-full p-3 rounded-lg bg-bgPrimary text-darkSecondary placeholder-primary focus:outline-none focus:ring focus:ring-primary'
      />

      {isOpen && (
        <div className='p-2 absolute top-full left-0 w-full bg-white shadow-lg mt-2 z-50'>
          {tracks.map((track) => (
            <TrackItem dropImage dropContext track={track} key={track.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
