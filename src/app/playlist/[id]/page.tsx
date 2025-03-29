// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import InfiniteScrollPlaylist from '@/app/playlist/components/InfiniteScrollPlaylist';
import PlaylistInfo from '@/app/playlist/components/PlaylistInfo';
import { getPlaylist, getPlaylistItems } from '@/api/spotify';

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

  const { newTracks } = await getPlaylistItems(id);
  const playlist = await getPlaylist(id);
  const initialTracks = uniqBy(newTracks, 'id');

  return (
    <div className=''>
      {playlist ? (
        <>
          <PlaylistInfo
            playlist={playlist}
            firstTrackUri={initialTracks[0].uri}
          />
          <InfiniteScrollPlaylist
            playlist={playlist}
            initialTracks={initialTracks}
          />
        </>
      ) : (
        <h1>no playlist info</h1>
      )}
    </div>
  );
}
