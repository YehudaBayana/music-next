// layout.tsx

import Providers from '@/app/Providers/Providers';
import './globals.css';
import Sidebar from '@/components/sidebar/Sidebar';
import Player from '@/components/player/Player';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import LandingPage from '@/app/(home)/components/landingPage/LandingPage';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  // if (!session?.accessToken) {
  //   return <LandingPage />;
  // }
  return (
    <html lang='en'>
      <head>
        <Script
          id='spotify-web-playback-sdk-setup'
          dangerouslySetInnerHTML={{
            __html: `
          window.onSpotifyWebPlaybackSDKReady = () => {
            window.SpotifyWebPlaybackSDKReady = true;
            console.log('Spotify Web Playback SDK Ready');
          };
        `,
          }}
        />
        <Script
          src='https://sdk.scdn.co/spotify-player.js'
          strategy='beforeInteractive'
        />
      </head>
      <body
        className={`${
          !session?.accessToken
            ? ' '
            : 'sm:pl-64 sm:pt-24 pt-8 pb-16 bg-bgPrimary'
        }`}
      >
        {!session?.accessToken ? (
          <LandingPage />
        ) : (
          <Providers>
            <Player />
            <Sidebar />
            <div className='container p-0'>{children}</div>
          </Providers>
        )}
      </body>
    </html>
  );
}
