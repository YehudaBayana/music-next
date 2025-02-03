// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import InfiniteScrollPlaylist from '@/app/playlist/InfiniteScrollPlaylist';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';
import TrackItem from '@/app/playlists/playlistCard/TrackItem';
import { getAlbum } from '@/utils/spotify/album/album';

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }

  const album = await getAlbum(session.accessToken, id);

  return (
    <div>
      <h4>Album Songs</h4>
      {album?.tracks.items.map((track) => (
        <TrackItem dropImage track={track} key={track.id} />
      ))}
    </div>
  );
}
