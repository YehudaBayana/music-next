// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import InfiniteScrollPlaylist from '@/app/playlist/components/InfiniteScrollPlaylist';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';
import TrackItem from '@/components/TrackItem';
import { getAlbum } from '@/utils/spotify/album/album';
import Image from 'next/image';
import { Album } from '@/utils/types';

const AlbumInfo = ({ album }: { album: Album }) => {
  return (
    <div className='relative w-full  p-8 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6'>
      <Image
        src={album?.images[0].url || '/placeholder.jpg'}
        alt={album?.name || 'album? image'}
        layout='fill'
        objectFit='cover'
        className='absolute inset-0 w-full h-full object-cover blur-sm brightness-50 -z-10'
      />
      <Image
        src={album?.images[0].url || '/placeholder.jpg'}
        width={200}
        height={200}
        alt={album?.name || 'album? image'}
        className='w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-lg shadow-lg'
      />
      <div className='text-center sm:text-left'>
        <h1 className='text-gray-300 text-3xl sm:text-5xl font-bold'>
          {album?.name}
        </h1>
        <p className='text-gray-300 mt-2 text-sm sm:text-base'>
          {album?.total_tracks} tracks
        </p>
        <p className='text-gray-300 text-sm mt-1'>{album?.artists[0].name}</p>
        <p className='text-gray-300 text-sm mt-1'>
          released at{' '}
          {album?.release_date || 'A curated selection of top tracks.'}
        </p>
      </div>
    </div>
  );
};

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
  if (!album) {
    return <h1>please login</h1>;
  }
  return (
    <div>
      <AlbumInfo album={album} />
      {album?.tracks.items.map((track) => (
        <TrackItem
          albumId={album.id}
          context='album'
          dropImage
          track={track}
          key={track.id}
        />
      ))}
    </div>
  );
}
