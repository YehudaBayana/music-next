import Link from 'next/link';
import React from 'react';

const CardsSlider = ({
  children,
  path,
  title,
}: {
  children: React.ReactNode;
  path?: string;
  title?: string;
}) => {
  return (
    <section className='mt-10'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>{title}</h2>
        {path && (
          <Link href={path}>
            <button
              // onClick={() => handleSeeAll('track')}
              className='text-green-500 hover:underline'
            >
              See All
            </button>
          </Link>
        )}
      </div>
      <div className='flex gap-4 overflow-x-scroll'>{children}</div>
    </section>
  );
};

export default CardsSlider;
