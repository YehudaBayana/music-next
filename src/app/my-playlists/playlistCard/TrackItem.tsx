import React from "react";
import { Track } from "@/utils/types";
import { BsThreeDots } from "react-icons/bs";
import { msToMinutesAndSeconds } from "@/utils/utils";

const TrackItem = ({ track }: { track: Track }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-300">
      <div className="flex items-center space-x-3 overflow-hidden">
        <img
          src={track.album.images[0].url}
          alt={track.name}
          className="w-12 h-12 rounded-lg object-cover"
        />
        <div className="overflow-hidden">
          <p
            className="text-sm font-medium truncate overflow-hidden text-ellipsis pr-2"
            title={track.name}
          >
            {track.name}
          </p>
          <p
            className="text-xs text-gray-500 truncate overflow-hidden text-ellipsis"
            title={track.artists[0].name}
          >
            {track.artists[0].name}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <p className="text-sm text-gray-600">
          {msToMinutesAndSeconds(track.duration_ms)}
        </p>
        <BsThreeDots className="text-gray-500 hover:text-purple-600 w-6 h-6" />
      </div>
    </div>
  );
};

export default TrackItem;
