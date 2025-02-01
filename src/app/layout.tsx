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
      <body className='pl-64 pt-28'>
        <Providers>
          <Player />
          <Sidebar />
          <div className='px-4'>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
