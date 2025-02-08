import Artist from '@/components/artists/Artist';
import CardsSlider from '@/components/CardsSlider';
import { Artist as ArtistType } from '@/utils/types';
import React from 'react';

const Artists = ({
  artists,
  path,
}: {
  artists: ArtistType[];
  path: string;
}) => {
  return (
    <CardsSlider path={path} title={'Artists'}>
      {artists.map((artist) => (
        <Artist artist={artist} key={artist.id} />
      ))}
    </CardsSlider>
  );
};

export default Artists;
