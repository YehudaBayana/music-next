// layout.tsx

import Providers from '@/app/Providers/Providers';
import './globals.css';
import Sidebar from '@/components/sidebar/Sidebar';
import Player from '@/components/player/Player';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import LandingPage from '@/app/(home)/components/landingPage/LandingPage';

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
        <script src='https://sdk.scdn.co/spotify-player.js' async></script>
      </head>
      <body
        className={`${
          !session?.accessToken
            ? ' '
            : 'sm:pl-64 sm:pt-28 pt-8 pb-16 bg-bgPrimary'
        }`}
      >
        {!session?.accessToken ? (
          <LandingPage />
        ) : (
          <Providers>
            <Player />
            <Sidebar />
            <div className='container'>{children}</div>
          </Providers>
        )}
      </body>
    </html>
  );
}
