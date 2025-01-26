// contexts/PlayerContext.tsx
"use client";
import { thisDeviceName } from "@/utils/constants";
import { CurrentTrack, Device, PlayerState, Track } from "@/utils/types";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PlayerContextType {
  currentTrack: Track | CurrentTrack | null;
  playTrack: (
    track: Track | CurrentTrack | null,
    progress: number,
    uris: string[]
  ) => void;
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
  const [deviceId, setDeviceId] = useState<Device>();
  const [player, setPlayer] = useState<SpotifyPlayerInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: session } = useSession();
  const accessToken = session?.accessToken;

  useEffect(() => {
    if (!accessToken) return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
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

      spotifyPlayer.addListener("initialization_error", ({ message }) =>
        console.error(message)
      );
      spotifyPlayer.addListener("authentication_error", ({ message }) =>
        console.error(message)
      );
      spotifyPlayer.addListener("account_error", ({ message }) =>
        console.error(message)
      );
      spotifyPlayer.addListener("playback_error", ({ message }) =>
        console.error(message)
      );

      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline:", device_id);
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

    player.addListener("player_state_changed", (state: PlayerState) => {
      if (state) {
        if (state.position > 0) {
          setProgress(state.position);
        }
        setIsPlaying(!state.paused);
        setCurrentTrack(state.track_window.current_track);
      }
    });

    return () => {
      if (player) {
        player.removeListener("player_state_changed");
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
      const response = await fetch("/api/spotify/player/devices", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = (await response.json()) as Device;
      console.log("data ", data);

      if (!response.ok) {
        return console.log("Failed to get a device");
      }
      setDeviceId(data);
    }
    if (!deviceId) {
      getAvailableDevices();
    }
    return () => { };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playTrack = async (
    track: Track | CurrentTrack | null,
    progressFromOutside: number,
    uris: string[]
  ) => {
    setCurrentTrack(track);
    const trackIndex = uris.findIndex((uri) => track?.uri === uri);
    try {
      if (uris.length === 0 && !track) {
        const response = await fetch("/api/spotify/player/play", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            deviceId: deviceId,
            position_ms: progressFromOutside,
          }),
        });
        if (!response.ok) {
          console.error("Failed to play track");
        }
      } else {
        const response = await fetch("/api/spotify/player/play", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            uris: uris.length === 0 ? [currentTrack?.uri] : uris,
            deviceId: deviceId,
            position_ms: progressFromOutside,
            offset: {
              position: trackIndex < 0 ? 0 : trackIndex,
            },
          }),
        });
        if (!response.ok) {
          console.error("Failed to play track");
        }
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
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
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
