// app/album/[id]/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getAlbum, getAlbumTracks } from '@/api/spotify';
import PageInfo from '@/components/PageInfo';
import AlbumTrackList from './AlbumTrackList';
import { Album } from '@/utils/types';

const AlbumInfo = ({ album }: { album: Album }) => (
  <PageInfo
    src={album?.images[0]?.url || '/placeholder.jpg'}
    alt={album?.name || 'album image'}
  >
    <h1 className='text-gray-300 text-3xl sm:text-5xl font-bold'>
      {album.name}
    </h1>
    <p className='text-gray-300 mt-2 text-sm sm:text-base'>
      {album.total_tracks} tracks
    </p>
    <p className='text-gray-300 text-sm mt-1'>{album.artists[0].name}</p>
    <p className='text-gray-300 text-sm mt-1'>Released: {album.release_date}</p>
  </PageInfo>
);

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return <p>You need to login to view this content</p>;
  }

  const album = await getAlbum(id);
  const tracks = (await getAlbumTracks(id)).items;

  if (!album) {
    return <h1>Album not found</h1>;
  }

  return (
    <div>
      <AlbumInfo album={album} />
      <AlbumTrackList album={album} tracks={tracks} />
    </div>
  );
}
