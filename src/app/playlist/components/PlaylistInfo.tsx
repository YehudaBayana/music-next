'use client';
import { spotifyClient } from '@/api/spotifyClient';
import ContextPlayButton from '@/components/ContextPlayButton';
import PageInfo from '@/components/PageInfo';
import ReorderButton from '@/components/ReorderButton';
import React, { useEffect, useState } from 'react';

const PlaylistInfo = ({
  playlist,
  firstTrackUri,
}: {
  playlist: Spotify.Playlist;
  firstTrackUri: string;
}) => {
  const [isPlaylistOwner, setIsPlaylistOwner] = useState(false);

  useEffect(() => {
    const something = async () => {
      const me = await spotifyClient.getCurrentUserProfile();
      setIsPlaylistOwner(playlist.owner.id === me.id);
    };

    something();

    return () => {};
  }, [playlist]);
  return (
    <PageInfo
      src={playlist.images[0].url || '/placeholder.jpg'}
      alt={playlist.name || 'playlist image'}
    >
      <h1 className='text-gray-300 text-3xl sm:text-5xl font-bold'>
        {playlist.name}
      </h1>
      <p className='text-gray-300 mt-2 text-sm sm:text-base'>
        {playlist.description || 'A curated selection of top tracks.'}
      </p>
      <p className='text-gray-300 text-sm mt-1'>
        {playlist.owner.display_name}
      </p>
      <ContextPlayButton contextUri={playlist.uri} trackUri={firstTrackUri} />
      {isPlaylistOwner && <ReorderButton playlistId={playlist.id} />}
    </PageInfo>
  );
};

export default PlaylistInfo;
