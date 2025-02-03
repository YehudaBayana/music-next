import PlaylistWithTracks from '@/app/(home)/components/playlists/PlaylistWithTracks';
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
      accessToken,
      5
    )
  ).items;
  //   console.log('topsify playlists', playlists);

  return (
    <div>
      <h1 className='text-3xl ml-12'>recommended for you</h1>
      <hr className='my-5 border-t-2 border-stone-800' />
      <div className='grid grid-cols-4 grid-rows-4 gap-4'>
        <div className='row-span-4 col-span-2 flex'>
          <div className='w-full aspect-square relative'>
            <Link href={`${PATHS.playlist}/${playlists[0].id}`}>
              <Image
                alt='test'
                src={playlists[0].images[0].url}
                layout='fill'
                objectFit='cover'
                className='rounded-2xl'
              />
            </Link>
          </div>
        </div>
        <div className='row-span-4 col-span-2'>
          <div className='grid grid-cols-2 grid-rows-3 gap-4'>
            {playlists.slice(1, 5).map((playlist) => (
              <div key={playlist.id} className='row-span-3'>
                <div className='w-full aspect-square relative '>
                  <Link href={`${PATHS.playlist}/${playlist.id}`}>
                    <Image
                      alt='test'
                      src={playlist.images[0].url}
                      layout='fill'
                      objectFit='cover'
                      className='rounded-2xl'
                    />
                  </Link>
                </div>
              </div>
            ))}
            {/* <PlaylistWithTracks playlistId={playlists[1].id} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
