import React from "react";
import { GrNext, GrPrevious } from "react-icons/gr";

interface CarouselControlsProps {
  currentIndex: number;
  cardsToShow: number;
  totalPlaylists: number;
  onPrev: () => void;
  onNext: () => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  currentIndex,
  cardsToShow,
  totalPlaylists,
  onPrev,
  onNext,
}) => {
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= totalPlaylists - cardsToShow;

  return (
    <>
      <GrPrevious
        onClick={onPrev}
        className={`w-11 h-11 absolute top-1/2 left-0 transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-md ${
          isPrevDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
        }`}
      />
      <GrNext
        onClick={onNext}
        className={`w-11 h-11 absolute top-1/2 right-0 transform -translate-y-1/2 z-10 p-2 bg-gray-200 rounded-full shadow-md ${
          isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
        }`}
      />
    </>
  );
};

export default CarouselControls;
