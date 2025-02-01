import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'image-cdn-ak.spotifycdn.com',
      'mosaic.scdn.co',
      'i.scdn.co',
      'image-cdn-fa.spotifycdn.com',
      'images.unsplash.com',
    ], // Add the Spotify CDN domain here
  },
};

export default nextConfig;
