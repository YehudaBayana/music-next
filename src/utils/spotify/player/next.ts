import { catchError } from '@/utils/utils';
import { SPOTIFY_API_URL } from '@/utils/constants';

export const nextTrackRequest = async (
  data: {
    accessToken: string;
  },
  deviceId?: string
) => {
  const url =
    `${SPOTIFY_API_URL}/me/player/next` +
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
  console.log('Playback next successfully');
};
