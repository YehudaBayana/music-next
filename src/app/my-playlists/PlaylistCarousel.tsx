"use client";
import React, { useState } from "react";
import { MyPlaylistItem } from "@/utils/types";
import PlaylistCard from "@/app/my-playlists/playlistCard/PlaylistCard";
import { GrNext, GrPrevious } from "react-icons/gr";

const PlaylistCarousel = ({ playlists }: { playlists: MyPlaylistItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsToShow = 2.5;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, playlists.length - cardsToShow)
    );
  };

  return (
    <div className="relative px-14">
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)`,
          }}
        >
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="flex-shrink-0 w-full px-2"
              style={{ width: `calc(100% / ${cardsToShow})` }}
            >
              <PlaylistCard playlist={playlist} />
            </div>
          ))}
        </div>
      </div>

      <GrPrevious
        onClick={handlePrev}
        className={`w-11 h-11 absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-md ${
          currentIndex === 0
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      />
      <GrNext
        onClick={handleNext}
        className={`w-11 h-11 absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-md ${
          currentIndex >= playlists.length - cardsToShow
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-300"
        }`}
      />
    </div>
  );
};

export default PlaylistCarousel;
