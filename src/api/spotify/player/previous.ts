import { catchError } from '@/utils/utils';

export const previousTrackRequest = async (
  data: {
    accessToken: string;
  },
  deviceId?: string
) => {
  const url =
    'https://api.spotify.com/v1/me/player/previous' +
    (deviceId ? `?device_id=${deviceId}` : '');
  console.log('url ', url);

  const [error] = await catchError(
    fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  );
  if (error) {
    return console.log('yuda error', error);
  }
  console.log('Playback previous successfully');
};
