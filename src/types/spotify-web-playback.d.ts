interface SpotifyPlayerInstance {
  name: string;
  connect(): Promise<boolean>;
  disconnect(): void;
  getCurrentState(): Promise<any | null>;
  addListener(event: string, callback: (data: any) => void): boolean;
  removeListener(event: string, callback?: (data: any) => void): boolean;
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
