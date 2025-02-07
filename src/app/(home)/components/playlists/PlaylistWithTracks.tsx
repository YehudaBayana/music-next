'use client';
import TrackItem from '@/components/TrackItem';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';
import { Track } from '@/utils/types';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const PlaylistWithTracks = ({ playlistId }: { playlistId: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
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
    getPlaylistTracks(playlistId, session.accessToken).then((res) => {
      setTracks(res.newTracks);
    });
    return () => {};
  }, [playlistId, session]);
  return (
    <div className='row-span-3 overflow-x-scroll min-h-min'>
      {tracks &&
        tracks.slice(0, 5).map((track) => (
          <TrackItem
            //   dropImage
            track={track}
            dropContext
            key={track.id}
            playlistId={playlistId}
          />
        ))}
    </div>
  );
};

export default PlaylistWithTracks;
