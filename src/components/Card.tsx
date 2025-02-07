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
          <Image src={src} alt={alt} fill className='rounded-md' />
        </div>
        {children}
      </div>
    </Link>
  );
};

export default Card;
