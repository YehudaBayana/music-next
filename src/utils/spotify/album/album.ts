import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { thisDeviceName } from '@/utils/constants';
import { Device, GetAlbumRes } from '@/utils/types';

export const getAlbum = async (accessToken: string, albumId: string) => {
  const url = `https://api.spotify.com/v1/albums/${albumId}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GetAlbumRes;
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
