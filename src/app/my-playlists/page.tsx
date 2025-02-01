import PlaylistCarousel from '@/app/my-playlists/playlistCarousel/PlaylistCarousel';
import Playlist from '@/app/search/components/playlists/Playlist';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { spotifyApi } from '@/utils/spotifyApi';
import { GetMyPlaylistsResponse } from '@/utils/types';
import { getServerSession } from 'next-auth';

export default async function MyPlaylistsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }
  const response = await spotifyApi.get<GetMyPlaylistsResponse>(
    '/me/playlists',
    session?.accessToken
  );
  const playlists = response.items;
  return (
    <div className='flex gap-4 overflow-x-scroll'>
      {playlists.map((playlist) => (
        <Playlist playlist={playlist} key={playlist.id} />
      ))}
    </div>
    // <div>
    //   <PlaylistCarousel playlists={playlists} />
    // </div>
  );
}
