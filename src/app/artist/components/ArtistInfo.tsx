'use client';

import Image from 'next/image';
import React from 'react';

const ArtistInfo = () => {
  const artist = {
    name: 'Pitbull',
    image: 'https://i.scdn.co/image/ab6761610000e5eb4051627b19277613e0e62a34',
    followers: 11230855,
    spotifyUrl: 'https://open.spotify.com/artist/0TnOYISbd1XYRBk9myaseg',
    topTracks: [
      { name: 'Give Me Everything', duration: '4:12' },
      { name: 'Timber', duration: '3:24' },
      { name: 'Time of Our Lives', duration: '3:49' },
      { name: 'International Love', duration: '3:47' },
      { name: 'Feel This Moment', duration: '3:49' },
    ],
  };

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Hero Section */}
      <div className='relative w-full h-[400px] overflow-hidden'>
        <Image
          src={artist.image}
          alt={artist.name}
          className='absolute inset-0 w-full h-full object-cover blur-lg brightness-50'
        />
        <div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900'></div>
        <div className='relative z-10 flex flex-col items-center justify-center h-full'>
          <Image
            src={artist.image}
            alt={artist.name}
            className='w-36 h-36 sm:w-48 sm:h-48 rounded-full shadow-xl border-4 border-white'
          />
          <h1 className='mt-4 text-4xl sm:text-5xl font-extrabold'>
            {artist.name}
          </h1>
          <p className='text-gray-300 text-lg mt-1'>
            {artist.followers.toLocaleString()} followers
          </p>
          <a
            href={artist.spotifyUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='mt-4 px-8 py-3 bg-green-500 text-black font-semibold text-lg rounded-full shadow-lg hover:bg-green-400 transition duration-300'
          >
            Listen on Spotify
          </a>
        </div>
      </div>

      {/* Top Tracks Section */}
      <div className='mt-10 px-6 sm:px-12 lg:px-20'>
        <h2 className='text-3xl font-bold border-b border-gray-700 pb-2'>
          Top Tracks
        </h2>
        <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {artist.topTracks.map((track, index) => (
            <div
              key={index}
              className='bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center transform hover:scale-105 transition duration-300'
            >
              <span className='font-medium'>{track.name}</span>
              <span className='text-gray-400'>{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistInfo;
