import { getPlaylistItems } from '@/api/spotify';
import PlaylistInfo from '@/app/playlists/components/drafts/playlistCard/PlaylistInfo';
import PlaylistTracks from '@/app/playlists/components/drafts/playlistCard/PlaylistTracks';
import { MyPlaylistItem } from '@/utils/types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const PlaylistCard = ({ playlist }: { playlist: MyPlaylistItem }) => {
  const [isLoading] = useState(true);
  const [tracks, setTracks] = useState<Spotify.Track[]>([]);
  const { data: session } = useSession();
  useEffect(() => {
    if (!session?.accessToken) {
      return console.log('no access token, please login');
    }
    // const getTracks = async () => {
    //   const endpoint = buildEndpoint('/playlists/{playlist_id}/tracks', {
    //     playlist_id: playlist.id,
    //   }) as SpotifyApiGetEndpoints;
    //   try {
    //     if (session?.accessToken) {
    //       const res = await spotifyApi.get<GetPlaylistTracksRes>(
    //         endpoint,
    //         session?.accessToken || ''
    //       );
    //       if (res.items.length > 0) {
    //       }
    //       setTracks(res.items.map((item) => item.track));
    //     }
    //   } catch (error) {
    //     console.log('yuda ', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    getPlaylistItems(playlist.id).then((res) => {
      setTracks(res.newTracks as Spotify.Track[]);
    });
    return () => {};
  }, [playlist.id, session]);

  return (
    <div className='w-full bg-gray-200 rounded-lg shadow-md p-4 flex flex-col overflow-hidden'>
      <div className='flex flex-col sm:flex-row sm:space-x-4 items-center sm:items-start overflow-hidden'>
        <Image
          src={playlist.images[0].url}
          width={playlist.images[0].width || 200}
          height={playlist.images[0].height || 200}
          alt='Playlist Cover'
          className='w-full sm:w-40 h-auto rounded-lg object-cover'
        />
        <PlaylistInfo playlist={playlist} />
      </div>
      <PlaylistTracks
        tracks={tracks}
        isLoading={isLoading}
        // playlistId={playlist.id}
      />
    </div>
  );
};

export default PlaylistCard;
