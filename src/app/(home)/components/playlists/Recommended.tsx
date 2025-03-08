import React from 'react';
import Playlists from '@/components/playlists/Playlists';
import { userIds } from '@/utils/constants';
import { getUserPlaylists, search } from '@/api/spotify';

const Recommended = async () => {
  const playlists = (await getUserPlaylists(userIds.topsify, { limit: 30 }))
    .items;

  const hiphopPlaylists = (
    await search('hip hop', ['playlist'], { offset: 0, limit: 30 })
  ).playlists?.items.filter((item) => item);

  return (
    <>
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
