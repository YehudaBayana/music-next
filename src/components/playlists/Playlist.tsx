import Card from '@/components/Card';
import { PATHS } from '@/components/sidebar/sidebarData';
import { MyPlaylistItem } from '@/utils/types';
import React from 'react';

const Playlist = ({ playlist }: { playlist: MyPlaylistItem }) => {
  return (
    <Card
      href={`${PATHS.playlist}/${playlist.id}`}
      src={playlist.images[0]?.url}
      alt={playlist.name}
    >
      <h3 className='text-sm font-medium mt-2'>{playlist.name}</h3>
    </Card>
  );
};

export default Playlist;
