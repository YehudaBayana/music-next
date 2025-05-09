// layout.tsx

import Providers from '@/app/Providers/Providers';
import './globals.css';
import Sidebar from '@/components/sidebar/Sidebar';
import Player from '@/components/player/Player';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import LandingPage from '@/app/(home)/components/landingPage/LandingPage';
import PwaWrapper from '@/components/pwa/PwaWrapper';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  console.log('session', session);

  // if (!session?.accessToken) {
  //   return <LandingPage />;
  // }
  return (
    <html lang='en'>
      <head>
        <script src='https://sdk.scdn.co/spotify-player.js' async></script>
        <meta name='application-name' content='Spotify Clone' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta
          name='apple-mobile-web-app-status-bar-style'
          content='black-translucent'
        />
        <meta name='apple-mobile-web-app-title' content='Spotify Clone' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#1DB954' />
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icons/icon-192x192.png' />
        <link rel='apple-touch-startup-image' href='/icons/splash.png' />

        {/* iOS splash screens */}
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)'
        />
        <link
          rel='apple-touch-startup-image'
          href='/icons/splash.png'
          media='(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)'
        />
        <script src='/sw-register.js' defer></script>
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
            <div className='container p-0'>
              <PwaWrapper />
              {children}
            </div>
          </Providers>
        )}
      </body>
    </html>
  );
}
