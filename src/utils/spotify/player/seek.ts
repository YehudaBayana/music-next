import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { catchError } from '@/utils/utils';

export const seekTrackRequest = async (
  data: {
    accessToken: string;
    position_ms: number;
  },
  deviceId?: string
) => {
  const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${
    data.position_ms
  }${deviceId ? `&device_id=${deviceId}` : ''}`;
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
  console.log('Playback previous successfully');
};
