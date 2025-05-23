import { DropResult } from '@hello-pangea/dnd';

/**
 * Represents a track item in the drag and drop context
 */
export interface DragItem {
  uri: string;
  id: string;
  index: number;
}

/**
 * Extended DropResult with additional properties specific to our implementation
 */
export interface PlaylistDropResult extends DropResult {
  playlistId?: string;
}

/**
 * Parameters for the Spotify API reorder tracks endpoint
 */
export interface ReorderTracksParams {
  range_start: number;
  range_length: number;
  insert_before: number;
}
