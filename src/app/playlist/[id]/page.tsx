// playlist/[id]/page.tsx
import uniqBy from "lodash/uniqBy";
import { getServerSession } from "next-auth";
import { getTracks } from "@/utils/spotifyApi";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import InfiniteScrollPlaylist from "@/app/playlist/InfiniteScrollPlaylist";

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

  const initialTracks = uniqBy(await getTracks(id, session.accessToken), "id");

  return (
    <div>
      <h4>Playlist Songs</h4>
      <InfiniteScrollPlaylist
        playlistId={id}
        accessToken={session.accessToken}
        initialTracks={initialTracks}
      />
    </div>
  );
}
