import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className='p-4min-h-screen'>
      {/* Recommended for You Section */}
      <div className='h-4 w-1/3 bg-primary animate-pulse rounded mb-4'></div>
      <div className='h-0.5 w-full bg-primary animate-pulse mb-6'></div>

      {[...Array(4)].map((_, index) => (
        <React.Fragment key={index}>
          {/* Hot Playlists Section */}
          <div className='h-6 w-1/4 bg-primary animate-pulse rounded mb-4'></div>
          <div className='flex gap-4 overflow-x-auto mb-8'>
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className='w-36 h-48 bg-primary animate-pulse rounded'
              ></div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default SkeletonLoader;
