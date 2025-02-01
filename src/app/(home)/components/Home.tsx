import { PATHS } from '@/components/sidebar/sidebarData';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { imageUrl, userIds } from '@/utils/constants';
import { fetchUserPlaylists } from '@/utils/spotifyApi';
import { GetMyPlaylistsResponse } from '@/utils/types';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Home = async ({ accessToken }: { accessToken: string }) => {
  const playlists = (
    await fetchUserPlaylists<GetMyPlaylistsResponse>(
      userIds.topsify,
      accessToken
    )
  ).items;
  //   console.log('topsify playlists', playlists);

  return (
    <div className='grid grid-cols-4 grid-rows-4 gap-4 bg-slate-300'>
      <div className='row-span-4 col-span-2 bg-slate-500 flex'>
        <div className='w-full aspect-square relative'>
          <Link href={`${PATHS.playlist}/${playlists[0].id}`}>
            <Image
              alt='test'
              src={playlists[0].images[0].url}
              layout='fill'
              objectFit='cover'
            />
          </Link>
        </div>
      </div>
      <div className='row-span-4 col-span-2 bg-slate-500'>
        <div className='grid grid-flow-col grid-rows-3 gap-4 bg-slate-300'>
          <div className='row-span-3 bg-slate-600 ...'>
            <div className='w-full aspect-square relative'>
              <Image
                alt='test'
                src={imageUrl}
                layout='fill'
                objectFit='cover'
              />
            </div>
          </div>
          <div className='row-span-3 bg-slate-600 ...'>02</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
