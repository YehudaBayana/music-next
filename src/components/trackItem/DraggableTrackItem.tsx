// components/trackItem/DraggableTrackItem.tsx
'use client';

import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import TrackItem from './TrackItem';
import { MdDragIndicator } from 'react-icons/md';

interface DraggableTrackItemProps {
  track: Spotify.Track | Spotify.Episode;
  index: number;
  context?: Spotify.Artist | Spotify.Playlist | Spotify.Album | Spotify.Show;
  isSelected?: boolean;
  onToggleSelect?: (e: React.MouseEvent) => void;
  nextUris?: string[];
  onTracksDeleted?: (deletedTrackUris: string[]) => void;
  dragHandleProps?: boolean; // Whether to show drag handle
}

const DraggableTrackItem: React.FC<DraggableTrackItemProps> = ({
  track,
  index,
  context,
  isSelected,
  onToggleSelect,
  nextUris = [],
  onTracksDeleted,
  dragHandleProps = true,
}) => {
  // Using type assertion to work around React 19 compatibility issues with react-beautiful-dnd
  const DraggableComponent = Draggable as any;

  return (
    <DraggableComponent draggableId={track.uri} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${
            snapshot.isDragging
              ? 'opacity-90 shadow-lg bg-gray-800 rounded-md z-10 scale-102'
              : ''
          } transition-all duration-200`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          {dragHandleProps && (
            <div
              {...provided.dragHandleProps}
              className='absolute left-0 top-0 bottom-0 flex items-center px-1 cursor-grab active:cursor-grabbing hover:text-purple-500 transition-colors duration-150 z-10 opacity-100'
            >
              <MdDragIndicator size={20} />
            </div>
          )}
          <TrackItem
            track={track}
            context={context}
            isSelected={isSelected}
            onToggleSelect={onToggleSelect}
            nextUris={nextUris}
            onTracksDeleted={onTracksDeleted}
          />
        </div>
      )}
    </DraggableComponent>
  );
};

export default DraggableTrackItem;
