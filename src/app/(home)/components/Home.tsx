import Recommended from '@/app/(home)/components/playlists/Recommended';
import SpecialRecom from '@/app/(home)/components/playlists/SpecialRecom';
import React from 'react';

const Home = async () => {
  return (
    <div>
      <SpecialRecom />
      <Recommended />
    </div>
  );
};

export default Home;
