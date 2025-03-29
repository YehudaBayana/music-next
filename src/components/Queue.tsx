import { spotifyClient } from '@/api/spotifyClient';
import TrackItem from '@/components/trackItem/TrackItem';
import { usePlayer } from '@/context/PlayerContext';
import { useQueue } from '@/context/QueueContext';
// import { msToMinutesAndSeconds } from '@/utils/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';

/**
 * Filters the queue to show only the remaining unique tracks from the playlist
 * and user-added tracks (no duplicates).
 */
async function getFilteredQueue(): Promise<Spotify.Track[]> {
  // Fetch the current queue and playback state
  const queueResponse = await spotifyClient.getQueue(); // fetchQueue(accessToken);
  const playbackState = await spotifyClient.getPlaybackState(); // fetchPlaybackState(accessToken);

  // If not playing from a playlist, return the raw queue
  if (!playbackState.context?.uri?.startsWith('spotify:playlist:')) {
    return queueResponse.queue;
  }

  // Get the playlist's track URIs
  const playlistId = playbackState.context.uri.split(':')[2];
  const playlistTracks = (
    await spotifyClient.getPlaylistItems(playlistId)
  ).items.map((item) => item.track); // fetchPlaylistTracks(accessToken, playlistId);
  const playlistTrackUris = playlistTracks.map((t) => t.uri);

  // Identify the current track's position in the playlist
  console.log('playbackState ', playbackState);

  const currentTrackIndex = playlistTrackUris.findIndex(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    (uri) => uri === playbackState.item?.uri
  );

  // Calculate remaining unique tracks from the playlist
  const remainingPlaylistTracks = playlistTracks.slice(currentTrackIndex + 1);

  // Filter the queue to include:
  // 1. Remaining playlist tracks (only once)
  // 2. All user-added tracks
  const seenPlaylistUris = new Set<string>();
  const filteredQueue: Spotify.Track[] = [];

  for (const track of queueResponse.queue) {
    //   const isFromPlaylist = track.added_by?.uri === 'spotify';
    //   const isUserAdded = track?.added_by?.uri === 'user';

    //   if (isUserAdded) {
    //     // Always include user-added tracks
    //     filteredQueue.push(track);
    //   } else if (isFromPlaylist) {
    // Include playlist tracks only if they're in the remaining list and not duplicates
    const isRemaining = remainingPlaylistTracks.some(
      (pt) => pt.uri === track.uri
    );
    if (isRemaining && !seenPlaylistUris.has(track.uri)) {
      filteredQueue.push(track);
      seenPlaylistUris.add(track.uri);
    }
    //   }
  }

  return filteredQueue;
}

export const Queue = () => {
  //   const [currentSongIndex, setCurrentSongIndex] = useState(0);
  //   const [currentTrack, setCurrentTrack] = useState<Spotify.Track>();
  const { currentTrack } = usePlayer();
  const [queue, setQueue] = useState<Spotify.Track[]>();
  const [context, setContext] = useState<Spotify.Context>();
  const { isOpen, closeQueue } = useQueue();

  useEffect(() => {
    const getQueue = async () => {
      const queueInside = await getFilteredQueue();
      const playback = await spotifyClient.getPlaybackState();
      setContext(playback.context);
      console.log('queueInside ', queueInside);
      setQueue(queueInside);
    };

    // TODO: refactor this setTimeout() because its a nasty solution
    setTimeout(() => {
      getQueue();
    }, 1500);

    return () => {};
  }, [currentTrack?.name]);

  if (!isOpen) {
    return null;
  }
  //   console.log('queue ', queue);

  // Mock data
  //   const queue: Song[] = [
  //     {
  //       id: 1,
  //       title: 'Digital Symphony',
  //       artist: 'Neon Waves',
  //       duration: '3:45',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 2,
  //       title: 'Electric Dreams',
  //       artist: 'Synth Orbit',
  //       duration: '4:20',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 3,
  //       title: 'Neon Nights',
  //       artist: 'Cyber Pulse',
  //       duration: '3:15',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 11,
  //       title: 'Digital Symphony',
  //       artist: 'Neon Waves',
  //       duration: '3:45',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 21,
  //       title: 'Electric Dreams',
  //       artist: 'Synth Orbit',
  //       duration: '4:20',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 31,
  //       title: 'Neon Nights',
  //       artist: 'Cyber Pulse',
  //       duration: '3:15',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 12,
  //       title: 'Digital Symphony',
  //       artist: 'Neon Waves',
  //       duration: '3:45',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 22,
  //       title: 'Electric Dreams',
  //       artist: 'Synth Orbit',
  //       duration: '4:20',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //     {
  //       id: 32,
  //       title: 'Neon Nights',
  //       artist: 'Cyber Pulse',
  //       duration: '3:15',
  //       artUrl:
  //         'https://plus.unsplash.com/premium_photo-1736765210162-8db26e3d02c4?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  //     },
  //   ];

  //   const currentTrack = queue[currentTrackIndex];

  return (
    <div className='fixed bottom-0 left-64 right-0 h-[calc(100vh-88px)] bg-black/90 backdrop-blur-xl text-white p-8 overflow-y-auto'>
      <div className='max-w-6xl mx-auto flex gap-8'>
        {/* Main Content */}
        <div className='flex-1 flex flex-col'>
          {/* Holographic Header */}
          <div className='relative mb-8'>
            <h1 onClick={closeQueue} className='text-5xl font-bold '>
              NOW PLAYING
            </h1>
            <div className='absolute inset-0 bg-cyan-400/20 blur-2xl -z-10' />
          </div>

          {/* Album Art Container */}
          <div className='relative flex-1 group h-[calc(100vh-160px)]'>
            <Image
              fill
              //   width={100}
              //   height={100}
              src={
                currentTrack?.type === 'track'
                  ? currentTrack.album.images[0].url
                  : ''
              }
              alt={currentTrack?.name || ''}
              className='w-auto h-auto object-cover rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-95'
            />
          </div>
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
              /> // context={context?.type}
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
