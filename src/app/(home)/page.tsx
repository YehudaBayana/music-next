import Recommended from '@/app/(home)/components/playlists/Recommended';
import SpecialRecommendations from '@/app/(home)/components/playlists/SpecialRecommendations';

export default async function HomePage() {
  return (
    <div className='container'>
      <SpecialRecommendations />
      <Recommended />
    </div>
  );
}
