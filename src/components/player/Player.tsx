import CurrentPlayingSong from "@/components/player/CurrentPlayingTrack";
import PlayerControls from "@/components/player/PlayerControls";
import SearchBar from "@/components/player/SearchBar";
import React from "react";

const Player = () => {
  return (
    <div
      className="bg-[#f4f7e3] p-4 flex items-center justify-between space-x-6 fixed top-0 left-64"
      style={{ width: "calc(100% - 16rem)" }}
    >
      <PlayerControls />
      <CurrentPlayingSong />
      <SearchBar />
    </div>
  );
};

export default Player;
