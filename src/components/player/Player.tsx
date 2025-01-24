import { imageUrl } from "@/utils/constants";
import React from "react";
import {
  IoPlaySkipBack,
  IoPlay,
  IoPlaySkipForward,
  IoShuffle,
  IoRepeat,
} from "react-icons/io5";

const Player = () => {
  return (
    <div
      className="bg-[#f4f7e3] p-4 flex items-center justify-between space-x-6 fixed top-0 left-64"
      style={{ width: "calc(100% - 16rem)" }} // Adjusts the width dynamically
    >
      {/* Player Controls */}
      <div className="flex items-center space-x-4 text-black">
        <IoShuffle className="w-6 h-6 cursor-pointer hover:text-gray-600" />
        <IoPlaySkipBack className="w-6 h-6 cursor-pointer hover:text-gray-600" />
        <IoPlay className="w-10 h-10 cursor-pointer hover:text-gray-600" />
        <IoPlaySkipForward className="w-6 h-6 cursor-pointer hover:text-gray-600" />
        <IoRepeat className="w-6 h-6 cursor-pointer hover:text-gray-600" />
      </div>

      {/* Current Playing Song */}
      <div className="flex items-center bg-white p-3 rounded-lg shadow-md space-x-4 w-1/3">
        <img
          src={imageUrl}
          alt="Album Cover"
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="overflow-hidden">
          <h4
            className="text-base font-bold text-black truncate"
            title="Bad Dreams"
          >
            Bad Dreams
          </h4>
          <p className="text-sm text-gray-500 truncate" title="Teddy Swims">
            Teddy Swims
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="w-1/4">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 rounded-lg bg-gray-200 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring focus:ring-green-400"
        />
      </div>
    </div>
  );
};

export default Player;
