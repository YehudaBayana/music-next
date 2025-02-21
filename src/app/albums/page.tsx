import Album from '@/components/albums/Album';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { spotifyApi } from '@/utils/spotifyApi';
import { GetAlbumsResponse } from '@/utils/types';
import { getServerSession } from 'next-auth';

export default async function MyAlbumsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }
  const response = await spotifyApi.get<GetAlbumsResponse>(
    '/me/albums',
    session?.accessToken
  );
  const albums = response.items.map((item) => item.album);
  return (
    <div className='flex gap-10 flex-wrap justify-start'>
      {albums.length > 0 ? (
        albums.map((album) => <Album album={album} key={album.id} />)
      ) : (
        <h1>you do not have saved albums</h1>
      )}
    </div>
  );
}
