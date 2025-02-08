import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className='p-4  min-h-screen'>
      {/* Header Section bg-green-100*/}
      <div className='relative w-full h-48 bg-primary animate-pulse rounded-lg overflow-hidden'>
        <div className='absolute inset-0 bg-gray-400 opacity-50'></div>
      </div>

      {/* Playlist Title */}
      <div className='mt-4'>
        <div className='h-6 w-3/4 bg-primary animate-pulse rounded'></div>
        <div className='h-4 w-1/2 bg-primary animate-pulse rounded mt-2'></div>
      </div>

      {/* Play Button */}
      <div className='mt-4 w-24 h-10 bg-primary animate-pulse rounded'></div>

      {/* Songs List */}
      <div className='mt-6 space-y-4'>
        {[...Array(10)].map((_, index) => (
          <div key={index} className='flex items-center gap-4'>
            <div className='w-12 h-12 bg-primary animate-pulse rounded'></div>
            <div className='flex-1'>
              <div className='h-4 w-3/4 bg-primary animate-pulse rounded'></div>
              <div className='h-3 w-1/2 bg-primary animate-pulse rounded mt-1'></div>
            </div>
            <div className='w-8 h-4 bg-primary animate-pulse rounded'></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
