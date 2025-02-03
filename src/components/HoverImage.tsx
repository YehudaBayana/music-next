import Image from 'next/image';
import Link from 'next/link';

interface HoverImageProps {
  src: string;
  alt: string;
  href: string;
  name: string;
  description: string;
}

const HoverImage = ({ src, alt, href, name, description }: HoverImageProps) => (
  <Link href={href} className='block'>
    <figure className='relative overflow-hidden text-center bg-[#000000be] group rounded-2xl'>
      <div className='relative w-full aspect-square'>
        <Image
          src={src}
          alt={alt}
          layout='fill'
          objectFit='cover'
          className='object-cover opacity-100 transition-transform duration-300 transform scale-110 group-hover:opacity-50 group-hover:scale-100'
        />
      </div>
      <figcaption className='absolute top-0 left-0 w-full h-full text-white uppercase text-lg flex flex-col items-center justify-center overflow-hidden'>
        <h2 className='px-4 py-4 bg-[#0b104190] rounded-2xl transition-transform duration-300 transform translate-y-5 group-hover:translate-y-0 truncate overflow-hidden text-ellipsis'>
          {name.slice(0, 20)}
        </h2>
        <p className=' opacity-0 transition-all duration-300 transform translate-y-5 scale-110 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100'>
          {description.slice(0, 40)}....
        </p>
      </figcaption>
    </figure>
  </Link>
);

export default HoverImage;
