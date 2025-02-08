import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Card = ({
  children,
  href,
  src,
  alt,
}: {
  children: React.ReactNode;
  src: string;
  alt: string;
  href: string;
}) => {
  return (
    <Link href={href}>
      <div className='w-40 flex-shrink-0'>
        <div className='w-full aspect-square relative'>
          <Image
            src={src}
            alt={alt}
            className='rounded-md'
            priority
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
        {children}
      </div>
    </Link>
  );
};

export default Card;
