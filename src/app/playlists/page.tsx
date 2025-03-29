import { getCurrentUserPlaylists } from '@/api/spotify';
import Playlist from '@/components/playlists/Playlist';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
// import { spotifyApi } from '@/utils/spotifyApi';
// import { GetMyPlaylistsResponse } from '@/utils/types';
import { getServerSession } from 'next-auth';

export default async function MyPlaylistsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }
  const response = await getCurrentUserPlaylists();
  const playlists = response.items;
  console.log('playlists ', playlists);

  return (
    <div className='flex gap-x-10 flex-wrap justify-start'>
      {playlists.length > 0 ? (
        playlists.map((playlist) => (
          <Playlist playlist={playlist} key={playlist.id} />
        ))
      ) : (
        <h1>you do not have saved playlists</h1>
      )}
    </div>
    // <div>
    //   <PlaylistCarousel playlists={playlists} />
    // </div>
  );
}
