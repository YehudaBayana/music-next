import PlaylistWithTracks from '@/app/(home)/components/playlists/PlaylistWithTracks';
import Playlists from '@/app/search/components/playlists/Playlists';
import Tracks from '@/app/search/components/tracks/Tracks';
import { PATHS } from '@/components/sidebar/sidebarData';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { imageUrl, userIds } from '@/utils/constants';
import { fetchUserPlaylists, searchSpotify } from '@/utils/spotifyApi';
import { GetMyPlaylistsResponse } from '@/utils/types';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Home = async ({ accessToken }: { accessToken: string }) => {
  const playlists = (
    await fetchUserPlaylists<GetMyPlaylistsResponse>(
      userIds.topsify,
      accessToken,
      5
    )
  ).items;
  const hiphopPlaylists = (
    await searchSpotify('hip hop', accessToken, 'playlist', 0, 30)
  )?.playlists.items.filter((item) => item);
  return (
    <div>
      <h1 className='text-3x'>recommended for you</h1>
      <hr className='my-5 border-t-2 border-stone-800' />
      {/* {results.tracks.length > 0 && (
        <Tracks tracks={results.tracks} handleSeeAll={handleSeeAll} />
      )} */}
      {playlists.length > 0 && (
        <Playlists playlists={playlists} title={'hot playlists'} />
      )}
      {hiphopPlaylists && hiphopPlaylists.length > 0 && (
        <Playlists playlists={hiphopPlaylists} title={'hip hop'} />
      )}
      {/* {results.albums.length > 0 && (
        <Albums albums={results.albums} handleSeeAll={handleSeeAll} />
      )} */}
      {/* {results.artists.length > 0 && (
        <Artists artists={results.artists} handleSeeAll={handleSeeAll} />
      )} */}
    </div>
  );
};

export default Home;
