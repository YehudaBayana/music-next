'use client';
import Card from '@/components/Card';
import { WithContextMenu } from '@/components/contextMenu/WithContextMenu';
import { useContextMenuOptions } from '@/components/playlists/hooks/useMenuOptions';
import { PATHS } from '@/components/sidebar/sidebarData';
// import { MyPlaylistItem } from '@/utils/types';
import React from 'react';

const Playlist = ({ playlist }: { playlist: Spotify.Playlist }) => {
  const contextMenuOptions = useContextMenuOptions({ playlist });

  return (
    <WithContextMenu options={contextMenuOptions}>
      <Card
        href={`${PATHS.playlist}/${playlist.id}`}
        src={playlist.images[0]?.url}
        alt={playlist.name}
      >
        <h3 className='text-sm font-medium mt-2'>{playlist.name}</h3>
      </Card>
    </WithContextMenu>
  );
};

export default Playlist;
