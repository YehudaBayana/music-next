import React from "react";
import { MyPlaylistItem } from "@/utils/types";
import Link from "next/link";
import { PATHS } from "@/components/sidebar/sidebarData";

const PlaylistInfo = ({ playlist }: { playlist: MyPlaylistItem }) => {
  return (
    <div className="text-center sm:text-left mt-4 sm:mt-0 overflow-hidden">
      <Link href={`${PATHS.playlist}/${playlist.id}`}>
        <h2
          className="text-xl font-bold overflow-hidden line-clamp-2"
          title={playlist.name}
        >
          {playlist.name}
        </h2>
      </Link>
      <p
        className="text-gray-600 truncate overflow-hidden text-ellipsis"
        title={playlist.owner.display_name}
      >
        {playlist.owner.display_name}
      </p>
      <p className="text-purple-600 font-bold">
        {playlist.tracks.total} Tracks
      </p>
    </div>
  );
};

export default PlaylistInfo;
