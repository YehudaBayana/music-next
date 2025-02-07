// playlist/[id]/page.tsx
import uniqBy from 'lodash/uniqBy';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import InfiniteScrollPlaylist from '@/app/playlist/components/InfiniteScrollPlaylist';
import { getPlaylistTracks } from '@/utils/spotify/playlist/playlist-tracks';
import TrackItem from '@/components/TrackItem';
import { getAlbum } from '@/utils/spotify/album/album';
import { getArtist } from '@/utils/spotify/artist/artist';
import ArtistInfo from '@/app/artist/components/ArtistInfo';

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }

  const artist = await getArtist(session.accessToken, [id]);
  console.log('artitst ', artist);

  return (
    <div>
      <h4>Artist</h4>
      <ArtistInfo />
      {/* {album?.tracks.items.map((track) => (
        <TrackItem dropImage track={track} key={track.id} />
      ))} */}
    </div>
  );
}
