import { spotifyClient } from '@/api/spotifyClient';
import TrackItem from '@/components/trackItem/TrackItem';
import { usePlayer } from '@/context/PlayerContext';
import { useQueue } from '@/context/QueueContext';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TrackCard = ({ currentTrack }: { currentTrack: Spotify.Track }) => {
  return (
    <div className='relative flex-1 group'>
      <Image
        fill
        src={
          currentTrack?.type === 'track' ? currentTrack.album.images[0].url : ''
        }
        alt={currentTrack?.name || ''}
        className='w-auto h-auto object-cover rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-95'
      />

      {/* Centered Overlay Content */}
      <div className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/70 rounded-lg'>
        <div className='text-center p-4 space-y-2'>
          <h3 className='text-white font-bold text-3xl truncate'>
            {currentTrack?.name || 'Song Name'}
          </h3>
          <p className='text-gray-300 text-2xl'>
            {currentTrack?.artists?.[0]?.name || 'Artist Name'}
          </p>
          <div className='text-gray-400 text-lg'>
            <p className='truncate'>
              {currentTrack?.album?.name || 'Album Name'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

async function getFilteredQueue(): Promise<Spotify.Track[]> {
  const [queueResponse, playbackState] = await Promise.all([
    spotifyClient.getQueue(),
    spotifyClient.getPlaybackState(),
  ]);

  console.log('playbackState.context?.uri ', playbackState.context?.uri);

  if (
    !playbackState.context?.uri ||
    !(
      playbackState.context.uri.startsWith('spotify:playlist:') ||
      playbackState.context.uri.startsWith('spotify:album:')
    )
  ) {
    return queueResponse.queue;
  }

  const playlistId = playbackState.context.uri.split(':')[2];
  const playlistTracks = playbackState.context?.uri?.startsWith(
    'spotify:playlist:'
  )
    ? (await spotifyClient.getPlaylistItems(playlistId)).items.map(
        (item) => item.track
      )
    : (await spotifyClient.getAlbumTracks(playlistId)).items;
  const playlistTrackUris = playlistTracks.map((t) => t.uri);

  const currentTrackIndex = playlistTrackUris.findIndex(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (uri) => uri === playbackState.item?.uri
  );
  if (currentTrackIndex === -1) {
    return queueResponse.queue; // or handle differently
  }

  const remainingPlaylistTracks = playlistTracks.slice(currentTrackIndex + 1);

  const seenPlaylistUris = new Set<string>();
  const filteredQueue: Spotify.Track[] = [];

  for (const track of queueResponse.queue) {
    const isRemaining = remainingPlaylistTracks.some(
      (pt) => pt.uri === track.uri
    );
    if (isRemaining && !seenPlaylistUris.has(track.uri)) {
      filteredQueue.push(track);
      seenPlaylistUris.add(track.uri);
    }
  }

  return filteredQueue;
}

export const Queue = () => {
  const currentTrack = usePlayer().currentTrack as Spotify.Track;
  const [queue, setQueue] = useState<Spotify.Track[]>();
  const [context, setContext] = useState<Spotify.Context>();
  const { isOpen, closeQueue } = useQueue();

  useEffect(() => {
    const getQueue = async () => {
      const queueInside = await getFilteredQueue();
      const playback = await spotifyClient.getPlaybackState();
      setContext(playback.context);

      setQueue(queueInside);
    };

    // TODO: refactor this setTimeout() because its a nasty solution
    setTimeout(() => {
      getQueue();
    }, 500);

    return () => {};
  }, [currentTrack?.name]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed bottom-0 left-64 right-0 h-[calc(100vh-88px)]  backdrop-blur-xl text-white p-8 overflow-y-auto'>
      <div className='max-w-6xl mx-auto flex gap-8 h-[calc(100vh-160px)]'>
        <div className='flex-1 flex flex-col'>
          <div className='relative mb-8'>
            <h1 onClick={closeQueue} className='text-5xl font-bold '>
              NOW PLAYING
            </h1>
            <div className='absolute inset-0 bg-cyan-400/20 blur-2xl -z-10' />
          </div>

          <TrackCard currentTrack={currentTrack} />
        </div>

        {/* Queue Sidebar */}
        <div className='w-96 bg-black/30 backdrop-blur-lg rounded-xl p-6 border border-white/10 max-h-[calc(100vh-160px)] overflow-y-auto'>
          <h2 className='text-2xl font-bold mb-6'>Up Next</h2>

          <div className='space-y-4 top-0 bottom-0'>
            {queue?.map((track, i) => (
              <TrackItem
                context={context?.type}
                context_uri={context?.uri}
                track={track}
                key={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
