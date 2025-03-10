// contexts/PlayerContext.tsx
'use client';
import { playOnSpotify } from '@/api/spotify/player/play';
import { thisDeviceName } from '@/utils/constants';
// import { CurrentTrack, PlayerState, Track } from '@/utils/types';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMyDevice } from '@/api/spotify/player/devices';

interface PlayerContextType {
  currentTrack: Spotify.Track | Spotify.Episode | Spotify.CurrentTrack | null;
  playTrack: (data: {
    uris?: string[];
    context_uri?: string;
    offset?: {
      position?: number;
      uri?: string;
    };
    position_ms?: number;
  }) => void;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrack, setCurrentTrack] = useState<
    Spotify.Track | Spotify.Episode | Spotify.CurrentTrack | null
  >(null);
  const [progress, setProgress] = useState<number>(0);
  const [deviceId, setDeviceId] = useState<string>();
  const [player, setPlayer] = useState<SpotifyPlayerInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!accessToken) return;
    const checkForSpotify = () => {
      if (window.Spotify) {
        const spotifyPlayer = new window.Spotify.Player({
          name: thisDeviceName,
          getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
          volume: 0.5,
        });

        spotifyPlayer.addListener('ready', ({ device_id }) => {
          console.log('Ready with Device ID:', device_id);
          setDeviceId(device_id);
        });

        spotifyPlayer.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline:', device_id);
        });

        spotifyPlayer.connect();
        setPlayer(spotifyPlayer);
      } else {
        console.log('Spotify SDK not available yet. Retrying...');
        setTimeout(checkForSpotify, 1000); // Retry every 1000ms
      }
    };

    checkForSpotify(); // Start checking

    return () => {
      if (player) {
        player.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', (state: Spotify.PlayerState) => {
      console.log('state ', state);

      if (state) {
        setCurrentTrack(state.track_window.current_track);
        setProgress(state.position);
        setIsPlaying(!state.paused);
      }
    });

    return () => {
      if (player) {
        player.removeListener('player_state_changed');
      }
    };
  }, [player, accessToken]);

  useEffect(() => {
    let progressInterval: number | undefined;

    if (isPlaying) {
      progressInterval = window.setInterval(() => {
        setProgress((prevProgress) => prevProgress + 1000);
      }, 1000);
    } else if (progressInterval !== undefined) {
      window.clearInterval(progressInterval);
    }

    return () => {
      if (progressInterval !== undefined) {
        window.clearInterval(progressInterval);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    async function getAvailableDevices() {
      if (!accessToken) {
        return;
      }
      const data = (await getMyDevice(accessToken)) as string;
      console.log('data ', data);

      setDeviceId(data);
    }
    if (!deviceId) {
      getAvailableDevices();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const playTrack = async ({
    uris,
    context_uri,
    offset,
    position_ms,
  }: {
    uris?: string[];
    context_uri?: string;
    offset?: {
      position?: number;
      uri?: string;
    };
    position_ms?: number;
  }) => {
    if (!accessToken) {
      return;
    }
    if (!accessToken) {
      return;
    }

    if (uris && context_uri) {
      throw new Error(
        'You cannot provide both `uris` and `context_uri` simultaneously.'
      );
    }

    const payload: {
      uris?: string[];
      context_uri?: string;
      offset?: {
        position?: number;
        uri?: string;
      };
      position_ms?: number;
    } = {};
    if (uris) payload.uris = uris;
    if (context_uri) payload.context_uri = context_uri;
    if (offset) payload.offset = offset;
    if (position_ms) payload.position_ms = position_ms;
    await playOnSpotify({ accessToken, ...payload }, deviceId || '');
  };

  return (
    <PlayerContext.Provider
      value={{ progress, setProgress, currentTrack, playTrack, isPlaying }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
