// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getPlaylist, getPlaylistItems, getSavedTracks } from '@/api/spotify';
import Header from '@/app/liked/components/Header';
import LikedList from '@/app/liked/components/LikedList';

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

  const res = await getSavedTracks();

  const initialTracks = uniqBy(
    res.items.map((item) => item.track),
    'id'
  );

  return (
    <div className=''>
      <Header tracksUris={initialTracks.map((item) => item.uri)} />
      <LikedList initialTracks={initialTracks} />
    </div>
  );
}
