// layout.tsx

import Providers from '@/app/Providers/Providers';
import './globals.css';
import Sidebar from '@/components/sidebar/Sidebar';
import Player from '@/components/player/Player';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='sm:pl-64 sm:pt-28 pt-8 pb-16 bg-bgPrimary'>
        <Providers>
          <Player />
          <Sidebar />
          <div className='container'>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
