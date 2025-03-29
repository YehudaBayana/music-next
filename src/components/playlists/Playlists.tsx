import CardsSlider from '@/components/CardsSlider';
import Playlist from '@/components/playlists/Playlist';
import React from 'react';

const Playlists = ({
  playlists,
  path,
  title = 'Playlists',
}: {
  playlists: Spotify.Playlist[];
  path?: string;
  title?: string;
}) => {
  return (
    <CardsSlider path={path} title={title}>
      {playlists.map((playlist) => (
        <Playlist playlist={playlist} key={playlist.id} />
      ))}
    </CardsSlider>
  );
};

export default Playlists;
