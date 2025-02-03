// contexts/PlayerContext.tsx
'use client';
import { playOnSpotify } from '@/utils/spotify/player/play';
import { thisDeviceName } from '@/utils/constants';
import { CurrentTrack, PlayerState, Track } from '@/utils/types';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMyDevice } from '@/utils/spotify/player/devices';

interface PlayerContextType {
  currentTrack: Track | CurrentTrack | null;
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
  const [currentTrack, setCurrentTrack] = useState<Track | CurrentTrack | null>(
    null
  );
  const [progress, setProgress] = useState<number>(0);
  const [deviceId, setDeviceId] = useState<string>();
  const [player, setPlayer] = useState<SpotifyPlayerInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: thisDeviceName,
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      spotifyPlayer.addListener('initialization_error', ({ message }) =>
        console.error(message)
      );
      spotifyPlayer.addListener('authentication_error', ({ message }) =>
        console.error(message)
      );
      spotifyPlayer.addListener('account_error', ({ message }) =>
        console.error(message)
      );
      spotifyPlayer.addListener('playback_error', ({ message }) =>
        console.error(message)
      );

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID:', device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline:', device_id);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      document.body.removeChild(script);
      if (player) {
        player.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', (state: PlayerState) => {
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
  }, [player]);

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
      // const response = await fetch('/api/spotify/player/devices', {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      if (!accessToken) {
        return console.log('no access token, please login');
      }
      const data = (await getMyDevice(accessToken)) as string;
      // console.log('data ', data);

      // if (!response.ok) {
      //   return console.log('Failed to get a device');
      // }
      setDeviceId(data);
    }
    if (!deviceId) {
      getAvailableDevices();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
