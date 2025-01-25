import React from "react";
import { Track } from "@/utils/types";
import TrackItem from "./TrackItem";

const PlaylistTracks = ({
  tracks,
  isLoading,
}: {
  tracks: Track[];
  isLoading: boolean;
}) => {
  return (
    <div className="mt-4">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        tracks
          .slice(0, 5)
          .map((track, index) => (
            <TrackItem key={index} track={track} playlistTracks={tracks} />
          ))
      )}
    </div>
  );
};

export default PlaylistTracks;
