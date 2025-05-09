'use client';
import React, { useState, useEffect } from 'react';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { spotifyClient } from '@/api/spotifyClient';
import useToast from '@/hooks/useToast';
import { useSession } from 'next-auth/react';
import { useLikedTracksStore } from '@/stores/likedTracksStore';

interface LikeButtonProps {
  trackId: string | undefined;
  isTrack: boolean;
  className?: string;
  showAlways?: boolean;
}

const LikeButton = ({ trackId, isTrack, className = '', showAlways = false }: LikeButtonProps) => {
  const { data: session } = useSession();
  const { success, error } = useToast();
  const [isLikeProcessing, setIsLikeProcessing] = useState<boolean>(false);
  
  // Get like status and methods from our store
  const { isTrackLiked, toggleTrackLiked, setTrackLiked } = useLikedTracksStore();
  
  // Check if the track is liked based on our store
  const isLiked = trackId ? isTrackLiked(trackId) : false;

  // Check if the track is saved in the user's library
  useEffect(() => {
    let isMounted = true;

    const checkIfSaved = async () => {
      if (!isTrack || !trackId || !session?.accessToken) return;

      try {
        const result = await spotifyClient.checkSavedTracks([trackId]);

        if (isMounted) {
          // Make sure we have a valid boolean result
          const isTrackLiked =
            Array.isArray(result) && result.length > 0 ? result[0] : false;
          
          // Update the store with the initial status
          setTrackLiked(trackId, isTrackLiked);
        }
      } catch (err) {
        console.error('Error checking if track is saved:', err);
      }
    };

    if (isTrack && trackId) {
      checkIfSaved();
    }

    return () => {
      isMounted = false;
    };
  }, [trackId, isTrack, session?.accessToken, setTrackLiked]);

  // Toggle liked status with optimistic updates
  const handleToggleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTrack || isLikeProcessing || !trackId) return;

    setIsLikeProcessing(true);

    try {
      // Use the store to toggle the liked status
      const newLikedState = await toggleTrackLiked(trackId);
      
      // Show toast notification
      if (newLikedState) {
        success('Added to your Liked Songs');
      } else {
        success('Removed from your Liked Songs');
      }
    } catch (err) {
      console.error('Error toggling like status:', err);
      error('Failed to update liked status');
    } finally {
      setIsLikeProcessing(false);
    }
  };

  // Don't render anything if not a track
  if (!isTrack) {
    return null;
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLikeProcessing}
      aria-label={isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
      className={`flex items-center justify-center ${
        isLikeProcessing ? 'cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {isLiked ? (
        <BsHeartFill
          className={`text-purple-600 hover:text-purple-700 w-5 h-5 ${
            isLikeProcessing ? 'opacity-70' : ''
          }`}
        />
      ) : (
        <BsHeart
          className={`text-gray-500 hover:text-purple-600 w-5 h-5 ${
            isLikeProcessing
              ? 'opacity-70'
              : showAlways ? '' : 'opacity-0 group-hover:opacity-100'
          } transition-opacity duration-200`}
        />
      )}
    </button>
  );
};

export default LikeButton;
