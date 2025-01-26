import { usePlayer } from "@/context/PlayerContext";
import { catchError } from "@/utils/utils";
import React from "react";
import {
  IoPlaySkipBack,
  IoPlay,
  IoPlaySkipForward,
  IoShuffle,
  IoRepeat,
  IoPause,
} from "react-icons/io5";

const pauseTrack = async () => {
  const [error] = await catchError(
    fetch("/api/spotify/player/pause", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
  );
  if (error) {
    console.log("yuda  ", error);
  }
};

const PlayerControls = () => {
  const { isPlaying, playTrack, currentTrack, progress } = usePlayer();
  return (
    <div className="flex items-center space-x-4 text-black">
      <IoShuffle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      <IoPlaySkipBack className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      {isPlaying ? (
        <IoPause
          onClick={pauseTrack}
          className="w-10 h-10 cursor-pointer hover:text-gray-600"
        />
      ) : (
        <IoPlay
          onClick={() => playTrack(currentTrack, progress, [])}
          className="w-10 h-10 cursor-pointer hover:text-gray-600"
        />
      )}

      <IoPlaySkipForward className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      <IoRepeat className="w-6 h-6 cursor-pointer hover:text-gray-600" />
    </div>
  );
};

export default PlayerControls;
