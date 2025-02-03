import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { catchError } from '@/utils/utils';

export const pauseRequest = async (
  data: {
    accessToken: string;
  },
  deviceId?: string
) => {
  const url =
    'https://api.spotify.com/v1/me/player/pause' +
    (deviceId ? `?device_id=${deviceId}` : '');
  console.log('url ', url);

  const [error] = await catchError(
    fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        'Content-Type': 'application/json',
      },
    })
  );
  if (error) {
    return console.log('yuda error', error);
  }
  console.log('Playback started successfully');
};
