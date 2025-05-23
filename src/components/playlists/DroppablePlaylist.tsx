'use client';

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { DroppableProvided, DroppableStateSnapshot } from '@hello-pangea/dnd';

interface DroppablePlaylistProps {
  droppableId: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A wrapper component that makes its children droppable using @hello-pangea/dnd
 */
const DroppablePlaylist: React.FC<DroppablePlaylistProps> = ({
  droppableId,
  children,
  className = '',
}) => {
  // Using type assertion to work around React 19 compatibility issues with react-beautiful-dnd
  const DroppableComponent = Droppable as any;
  
  return (
    <DroppableComponent droppableId={droppableId}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => {
        // Using type assertion to work around React 19 compatibility issues
        const placeholder = provided.placeholder as React.ReactNode;
        
        return (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`${className} ${snapshot.isDraggingOver ? 'bg-gray-900 bg-opacity-50' : ''}`}
          >
            {children}
            {placeholder}
          </div>
        );
      }}
    </DroppableComponent>
  );
};

export default DroppablePlaylist;
