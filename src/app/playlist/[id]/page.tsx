// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import InfiniteScrollPlaylist from '@/app/playlist/InfiniteScrollPlaylist';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }

  const { newTracks } = await getPlaylistTracks(id, session.accessToken);
  const initialTracks = uniqBy(newTracks, 'id');

  return (
    <div>
      <h4>Playlist Songs</h4>
      <InfiniteScrollPlaylist
        playlistId={id}
        accessToken={session.accessToken}
        initialTracks={initialTracks}
      />
    </div>
  );
}
