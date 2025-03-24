// app/album/[id]/AlbumTrackList.tsx
'use client';

import { useState, useEffect } from 'react';
import TrackItem from '@/components/trackItem/TrackItem';
import BulkActionsBar from '@/components/bulkActionsBar/BulkActionsBar';

const AlbumTrackList = ({
  album,
  tracks,
}: {
  album: Spotify.Album;
  tracks: Spotify.Track[];
}) => {
  const [selectedTrackUris, setSelectedTrackUris] = useState<string[]>([]);
  const [lastSelectedUri, setLastSelectedUri] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTrackUris([]);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTrackSelect = (trackUri: string, e: React.MouseEvent) => {
    if (e.shiftKey && lastSelectedUri) {
      const lastIndex = tracks.findIndex((t) => t.uri === lastSelectedUri);
      const currentIndex = tracks.findIndex((t) => t.uri === trackUri);

      if (lastIndex === -1 || currentIndex === -1) return;

      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);
      const rangeUris = tracks.slice(start, end + 1).map((t) => t.uri);

      setSelectedTrackUris((prev) => [...new Set([...prev, ...rangeUris])]);
    } else {
      setSelectedTrackUris((prev) =>
        prev.includes(trackUri)
          ? prev.filter((uri) => uri !== trackUri)
          : [...prev, trackUri]
      );
    }
    setLastSelectedUri(trackUri);
  };

  return (
    <div className='relative'>
      {tracks.map((track) => (
        <TrackItem
          key={track.uri}
          track={track}
          albumId={album.id}
          context='album'
          dropImage
          isSelected={selectedTrackUris.includes(track.uri)}
          onToggleSelect={(e: React.MouseEvent) =>
            handleTrackSelect(track.uri, e)
          }
        />
      ))}

      <BulkActionsBar
        selectedTrackUris={selectedTrackUris}
        setSelectedTrackUris={setSelectedTrackUris}
        contextType='album'
        context={album}
      />
    </div>
  );
};

export default AlbumTrackList;
