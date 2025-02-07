import React from 'react';
import { FaPlay } from 'react-icons/fa';

const ActionBar = () => {
  return (
    <div className='sticky top-0 sm:top-24 bg-gray-800/90 backdrop-blur-lg px-6 py-3 flex items-center justify-between shadow-md z-10'>
      <button className='bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded-full flex items-center space-x-2 text-sm font-semibold'>
        <FaPlay className='w-4 h-4' />
        <span>Play</span>
      </button>
      <button className='text-gray-300 hover:text-white text-sm flex items-center space-x-2'>
        {/* <FaShuffle className='w-4 h-4' /> */}
        <span>Shuffle</span>
      </button>
    </div>
  );
};

export default ActionBar;
