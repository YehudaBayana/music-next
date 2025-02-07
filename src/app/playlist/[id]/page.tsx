// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import InfiniteScrollPlaylist from '@/app/playlist/components/InfiniteScrollPlaylist';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';
import { getPlaylist } from '@/utils/spotify/playlist/playlist';
import ActionBar from '@/app/playlist/components/ActionBar';
import PlaylistInfo from '@/app/playlist/components/PlaylistInfo';

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
  const playlist = await getPlaylist(session.accessToken, id);
  const initialTracks = uniqBy(newTracks, 'id');

  return (
    <div className='min-h-screen'>
      {playlist ? (
        <PlaylistInfo playlist={playlist} />
      ) : (
        <h1>no playlist info</h1>
      )}

      <ActionBar />
      <InfiniteScrollPlaylist
        playlistId={id}
        accessToken={session.accessToken}
        initialTracks={initialTracks}
      />
    </div>
  );
}
