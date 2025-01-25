import _ from "lodash";
import { getServerSession } from "next-auth";
import { GetPlaylistTracksRes } from "../../../utils/types";
import { spotifyApi, SpotifyApiGetEndpoints } from "@/utils/spotifyApi";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { buildEndpoint } from "@/utils/utils";
import TrackItem from "@/app/my-playlists/playlistCard/TrackItem";

const getTracks = async (id: string, accessToken: string) => {
  const endpoint = buildEndpoint("/playlists/{playlist_id}/tracks", {
    playlist_id: id,
  }) as SpotifyApiGetEndpoints;
  try {
    const res = await spotifyApi.get<GetPlaylistTracksRes>(
      endpoint,
      accessToken || ""
    );
    if (res.items.length > 0) {
    }
    return res.items.map((item) => item.track);
  } catch (error) {
    console.log("Yuda err", error);
  }
};

export default async function PlaylistPage({
  params,
}: {
  params: { id: string };
}) {
  // await here looks redundant but next js specifies to await the params
  const id = (await params)?.id as string;
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return <p>You are not authenticated. Please log in.</p>;
  }
  const tracks = await getTracks(id, session.accessToken);
  const uniqueTracks = _.uniqBy(tracks, "id");

  return (
    <div>
      <h4>Playlist Songs</h4>
      {uniqueTracks.map((track) => (
        <TrackItem key={track.id} track={track} playlistTracks={uniqueTracks} />
      ))}
    </div>
  );
}
