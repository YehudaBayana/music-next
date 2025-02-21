import Recommended from '@/app/(home)/components/playlists/Recommended';
import SpecialRecom from '@/app/(home)/components/playlists/SpecialRecom';
import React from 'react';

const Home = async ({ accessToken }: { accessToken: string }) => {
  return (
    <div>
      <SpecialRecom />
      <Recommended accessToken={accessToken} />
    </div>
  );
};

export default Home;
