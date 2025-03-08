import { SPOTIFY_API_URL } from '@/utils/constants';


export const playOnSpotify = async (
  data: {
    accessToken: string;
    uris?: string[];
    context_uri?: string;
    offset?: {
      position?: number;
      uri?: string;
    };
    position_ms?: number;
  },
  deviceId?: string
) => {
  const url =
    `${SPOTIFY_API_URL}/me/player/play` +
    (deviceId ? `?device_id=${deviceId}` : '');
  console.log('url ', url);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('Fetch error:', await response.json());
      return;
    }

    console.log('Playback started successfully');
  } catch (error) {
    console.error('Error:', error);
  }
};
