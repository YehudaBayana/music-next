import Recommended from '@/app/(home)/components/playlists/Recommended';
import React from 'react';

const Home = async ({ accessToken }: { accessToken: string }) => {
  return (
    <div>
      <Recommended accessToken={accessToken} />
    </div>
  );
};

export default Home;
