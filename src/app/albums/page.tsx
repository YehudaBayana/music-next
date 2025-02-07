import Album from '@/app/search/components/albums/Album';
import Playlist from '@/app/search/components/playlists/Playlist';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { spotifyApi } from '@/utils/spotifyApi';
import { GetAlbumsResponse, GetMyPlaylistsResponse } from '@/utils/types';
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
      {albums.map((album) => (
        <Album album={album} key={album.id} />
      ))}
    </div>
    // <div>
    //   <PlaylistCarousel playlists={playlists} />
    // </div>
  );
}
