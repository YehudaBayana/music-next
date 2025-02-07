import React from 'react';
import Playlists from '@/app/search/components/playlists/Playlists';
import { userIds } from '@/utils/constants';
import { fetchUserPlaylists, searchSpotify } from '@/utils/spotifyApi';
import { GetMyPlaylistsResponse } from '@/utils/types';

const Recommended = async ({ accessToken }: { accessToken: string }) => {
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
    <>
      <h1 className='text-3x'>recommended for you</h1>
      <hr className='my-5 border-t-2 border-stone-800' />
      {playlists.length > 0 && (
        <Playlists playlists={playlists} title={'hot playlists'} />
      )}
      {hiphopPlaylists && hiphopPlaylists.length > 0 && (
        <Playlists playlists={hiphopPlaylists} title={'hip hop'} />
      )}
    </>
  );
};

export default Recommended;
