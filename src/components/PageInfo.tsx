import Image from 'next/image';
import React from 'react';

const PageInfo = ({
  children,
  src,
  alt,
}: {
  children: React.ReactNode;
  src: string;
  alt: string;
}) => {
  return (
    <div className='relative w-full  p-8 flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6'>
      <Image
        src={src}
        alt={alt}
        layout='fill'
        objectFit='cover'
        className='absolute inset-0 w-full h-full object-cover blur-sm brightness-50 -z-10'
      />
      <Image
        src={src}
        alt={alt}
        width={200}
        height={200}
        className='w-40 h-40 sm:w-52 sm:h-52 object-cover rounded-lg shadow-lg'
      />
      <div className='text-center sm:text-left'>{children}</div>
    </div>
  );
};

export default PageInfo;
