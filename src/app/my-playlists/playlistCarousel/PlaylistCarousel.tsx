'use client';
import React, { useState } from 'react';
import { MyPlaylistItem } from '@/utils/types';
import PlaylistContainer from './PlaylistContainer';
import CarouselControls from './CarouselControls';

interface PlaylistCarouselProps {
  playlists: MyPlaylistItem[];
}

const PlaylistCarousel: React.FC<PlaylistCarouselProps> = ({ playlists }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 5;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, playlists.length - cardsToShow)
    );
  };

  return (
    <div className='relative px-14'>
      <PlaylistContainer
        playlists={playlists}
        currentIndex={currentIndex}
        cardsToShow={cardsToShow}
      />
      <CarouselControls
        currentIndex={currentIndex}
        cardsToShow={cardsToShow}
        totalPlaylists={playlists.length}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default PlaylistCarousel;
