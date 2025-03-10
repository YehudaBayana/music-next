// playlist/[id]/page.tsx
import ArtistInfo from '@/app/artist/components/ArtistInfo';

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log('id ', id);

  return (
    <div>
      <h4>Artist: yuda</h4>
      <ArtistInfo />
    </div>
  );
}
