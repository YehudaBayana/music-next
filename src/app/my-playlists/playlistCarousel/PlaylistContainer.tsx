import React from "react";
import { MyPlaylistItem } from "@/utils/types";
import PlaylistCard from "@/app/my-playlists/playlistCard/PlaylistCard";

interface PlaylistContainerProps {
  playlists: MyPlaylistItem[];
  currentIndex: number;
  cardsToShow: number;
}

const PlaylistContainer: React.FC<PlaylistContainerProps> = ({
  playlists,
  currentIndex,
  cardsToShow,
}) => {
  return (
    <div className="w-full overflow-hidden">
      <div
        className={`flex transition-transform duration-500`}
        style={{
          transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)`,
        }}
      >
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="flex-shrink-0 px-2"
            style={{ width: `calc(100% / ${cardsToShow})` }}
          >
            <PlaylistCard playlist={playlist} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistContainer;
