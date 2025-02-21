import React from 'react';
// import Playlists from '@/components/playlists/Playlists';
// import { userIds } from '@/utils/constants';
// import { fetchUserPlaylists, searchSpotify } from '@/utils/spotifyApi';
// import { GetMyPlaylistsResponse } from '@/utils/types';

const SpecialRecom = async () => {
  //{ accessToken }: { accessToken: string }
  // const playlists = (
  //   await fetchUserPlaylists<GetMyPlaylistsResponse>(
  //     userIds.topsify,
  //     accessToken,
  //     30
  //   )
  // ).items;

  return (
    <>
      <h1 className='text-3x'>recommended for you</h1>
      <hr className='my-5 border-t-2 border-stone-800' />
      <div className='grid grid-cols-12 gap-4 h-80'>
        <div className='col-span-6 row-span-3 bg-slate-500'>01</div>
        <div className='grid gap-4 col-span-6 row-span-3 bg-slate-600 overflow-auto'>
          <div className='bg-slate-400 grid grid-cols-2 gap-4'>
            <div className='bg-red-400'>02</div>
            <div className='bg-red-400'>02</div>
          </div>
          <div className='bg-slate-400 grid grid-cols-2 gap-4'>
            <div className='bg-red-400'>03</div>
            <div className='bg-red-400'>03</div>
          </div>
          <div className='bg-slate-400 grid grid-cols-2 gap-4'>
            <div className='bg-red-400'>04</div>
            <div className='bg-red-400'>04</div>
          </div>
        </div>
      </div>
      {/* {playlists.length > 0 && (
        <Playlists playlists={playlists} title={'hot playlists'} />
      )} */}
    </>
  );
};

export default SpecialRecom;
