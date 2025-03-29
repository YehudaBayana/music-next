import React from 'react';
import {
  getCurrentUserRecentlyPlayed,
  getCurrentUserTopItems,
  getPlaylist,
} from '@/api/spotify';
import { extractPlaylistItems } from '@/utils/utils';
import TrackItem from '@/components/trackItem/TrackItem';
import Image from 'next/image';
import ContextPlayButton from '@/components/ContextPlayButton';

const SpecialRecom = async () => {
  // const res = await getCurrentUserTopItems('tracks', { limit: 5 });
  const res = await getCurrentUserTopItems('tracks');
  const res2 = await getCurrentUserRecentlyPlayed();
  const tracks = res.items;
  const playlistsId = extractPlaylistItems(res2.items)[0];
  const firstPlaylist = await getPlaylist(playlistsId);
  // const playlistsPromises = playlistsIds.map((id) => getPlaylist(id));
  // const topPlaylists = await Promise.all(playlistsPromises);
  // console.log('topPlaylists', topPlaylists[1]);

  return (
    <>
      <h1 className='text-3xl'>Home</h1>
      <hr className='my-5 border-t-2 border-stone-800' />
      <div className='grid grid-cols-12 gap-4 h-auto'>
        <div className='col-span-6 h-0'>for you</div>
        <div className='grid col-span-6 overflow-auto'>
          <h1>mostly played</h1>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-4 h-96 '>
        <div className='col-span-6 row-span-3 relative rounded-lg overflow-hidden'>
          {/* Image */}
          <Image
            src={firstPlaylist?.images[0]?.url}
            alt='mashu'
            fill
            className='w-full h-full object-cover'
          />

          {/* Overlay */}
          <div className='absolute inset-0 bg-black/50'></div>

          {/* Play Button */}
          <div className='absolute inset-0 flex items-end justify-start ml-6 mb-6'>
            <ContextPlayButton
              contextUri={firstPlaylist.uri}
              trackUri={firstPlaylist.tracks.items[0].track.uri}
            />
          </div>
        </div>

        <div className='grid gap-4 col-span-6 row-span-3 overflow-auto'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='relative'>
              {tracks.slice(0, 6).map((track, i) => (
                <TrackItem
                  key={track.id}
                  track={track as Spotify.Track}
                  nextUris={tracks.slice(i + 1).map((track) => track.uri)}
                />
              ))}
            </div>
            <div>
              {tracks.slice(6, 12).map((track, i) => (
                <TrackItem
                  key={track.id}
                  track={track as Spotify.Track}
                  nextUris={tracks.slice(i + 1).map((track) => track.uri)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SpecialRecom;
