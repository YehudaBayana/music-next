import { getCurrentUserAlbums } from '@/api/spotify';
import Album from '@/components/albums/Album';

export default async function MyAlbumsPage() {
  const response = await getCurrentUserAlbums();
  const albums = response.items.map((item) => item.album);

  return (
    <div className='flex gap-10 flex-wrap justify-start'>
      {albums.length > 0 ? (
        albums.map((album) => <Album album={album} key={album.id} />)
      ) : (
        <h1>you do not have saved albums</h1>
      )}
    </div>
  );
}
