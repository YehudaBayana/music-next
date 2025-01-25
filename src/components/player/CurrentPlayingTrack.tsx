"use client";
import React, { useState } from "react";
import { usePlayer } from "@/context/PlayerContext";

const CurrentPlayingSong = () => {
  const { currentTrack, progress } = usePlayer();

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    // Optionally, send this new progress value to the backend or player
    console.log("Slider moved to:", newValue);
  };

  return (
    <div className="flex items-center p-2 border-2 border-neutral-400 space-x-4 md:w-1/2 w-full overflow-hidden">
      <img
        src={currentTrack?.album.images[0].url} // Dynamic album art
        alt={currentTrack?.name || "Album Cover"}
        className="w-12 h-12 rounded-lg object-cover flex-none"
      />
      <div className="flex-1 flex justify-center items-center flex-col gap-1 overflow-visible">
        <h4
          className="text-base font-bold text-black truncate"
          title={currentTrack?.name || "Unknown Title"}
        >
          {currentTrack?.name || "Unknown Title"}
        </h4>
        <p
          className="text-sm text-gray-500 truncate"
          title={currentTrack?.artists[0].name || "Unknown Artist"}
        >
          {currentTrack?.artists[0].name || "Unknown Artist"}
        </p>
        <input
          id="slider"
          type="range"
          min="0"
          max={currentTrack?.duration_ms || 100} // Use the track's duration
          value={progress} // Bind slider to the progress value
          onChange={handleSliderChange} // Handler for slider changes
          className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer accent-blue-500 thumb-sm"
        />
      </div>
    </div>
  );
};

export default CurrentPlayingSong;
