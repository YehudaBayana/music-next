import Album from '@/components/albums/Album';
import CardsSlider from '@/components/CardsSlider';
import { Album as AlbumType } from '@/utils/types';
import Link from 'next/link';
import React from 'react';

const Albums = ({ albums, path }: { albums: AlbumType[]; path: string }) => {
  return (
    <CardsSlider path={path} title={'Albums'}>
      {albums.map((album) => (
        <Album album={album} key={album.id} />
      ))}
    </CardsSlider>
  );
};

export default Albums;
