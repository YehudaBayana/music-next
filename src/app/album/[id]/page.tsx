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
import PageInfo from '@/components/PageInfo';

const AlbumInfo = ({ album }: { album: Album }) => {
  return (
    <PageInfo
      src={album?.images[0].url || '/placeholder.jpg'}
      alt={album?.name || 'album? image'}
    >
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
    </PageInfo>
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
