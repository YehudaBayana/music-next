'use client';
import TrackItem from '@/components/trackItem/TrackItem';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { getPlaylistItems } from '@/api/spotify';

const PlaylistWithTracks = ({ playlistId }: { playlistId: string }) => {
  const [tracks, setTracks] = useState<(Spotify.Track | Spotify.Episode)[]>([]);
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
    getPlaylistItems(playlistId).then((res) => {
      setTracks(res.newTracks);
    });
    return () => {};
  }, [playlistId, session]);
  return (
    <div className='row-span-3 overflow-x-scroll min-h-min'>
      {tracks &&
        tracks
          .slice(0, 5)
          .map((track) => (
            <TrackItem
              track={track}
              dropContext
              key={track.id}
              playlistId={playlistId}
              context='playlist'
            />
          ))}
    </div>
  );
};

export default PlaylistWithTracks;
