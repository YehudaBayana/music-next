interface SpotifyPlayerInstance {
  // @ts-nocheck
  name: string;
  connect(): Promise<boolean>;
  disconnect(): void;
  getCurrentState(): Promise<never | null>;
  addListener(event: string, callback: (data: never) => void): boolean;
  removeListener(event: string, callback?: (data: never) => void): boolean;
}

interface Spotify {
  Player: new (options: {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
    volume?: number;
  }) => SpotifyPlayerInstance;
}

interface Window {
  Spotify: Spotify;
}
