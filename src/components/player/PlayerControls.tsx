import { usePlayer } from "@/context/PlayerContext";
import React from "react";
import {
  IoPlaySkipBack,
  IoPlay,
  IoPlaySkipForward,
  IoShuffle,
  IoRepeat,
  IoPause,
} from "react-icons/io5";

const PlayerControls = () => {
  const { isPlaying } = usePlayer();
  return (
    <div className="flex items-center space-x-4 text-black">
      <IoShuffle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      <IoPlaySkipBack className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      {isPlaying ? (
        <IoPause className="w-10 h-10 cursor-pointer hover:text-gray-600" />
      ) : (
        <IoPlay className="w-10 h-10 cursor-pointer hover:text-gray-600" />
      )}

      <IoPlaySkipForward className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      <IoRepeat className="w-6 h-6 cursor-pointer hover:text-gray-600" />
    </div>
  );
};

export default PlayerControls;
