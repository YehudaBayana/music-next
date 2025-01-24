import PlaylistInfo from "@/app/my-playlists/playlistCard/PlaylistInfo";
import PlaylistTracks from "@/app/my-playlists/playlistCard/PlaylistTracks";
import { spotifyApi, SpotifyApiGetEndpoints } from "@/utils/spotifyApi";
import { GetPlaylistTracksRes, MyPlaylistItem, Track } from "@/utils/types";
import { buildEndpoint } from "@/utils/utils";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const PlaylistCard = ({ playlist }: { playlist: MyPlaylistItem }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const { data: session } = useSession();
  useEffect(() => {
    const getTracks = async () => {
      const endpoint = buildEndpoint("/playlists/{playlist_id}/tracks", {
        playlist_id: playlist.id,
      }) as SpotifyApiGetEndpoints;
      try {
        if (session?.accessToken) {
          const res = await spotifyApi.get<GetPlaylistTracksRes>(
            endpoint,
            session?.accessToken || ""
          );
          if (res.items.length > 0) {
          }
          setTracks(res.items.map((item) => item.track));
        }
      } catch (error) {
        console.log("yuda ", error);
      } finally {
        setIsLoading(false);
      }
    };
    getTracks();
    return () => {};
  }, [session]);

  return (
    <div className="w-full bg-gray-200 rounded-lg shadow-md p-4 flex flex-col overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:space-x-4 items-center sm:items-start overflow-hidden">
        <img
          src={playlist.images[0].url}
          alt="Playlist Cover"
          className="w-full sm:w-40 h-auto rounded-lg object-cover"
        />
        <PlaylistInfo playlist={playlist} />
      </div>
      <PlaylistTracks tracks={tracks} isLoading={isLoading} />
    </div>
  );
};

export default PlaylistCard;
