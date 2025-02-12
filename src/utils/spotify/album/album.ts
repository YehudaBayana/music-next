import { Album } from '@/utils/types';
import { SPOTIFY_API_URL } from '@/utils/constants';

export const getAlbum = async (accessToken: string, albumId: string) => {
  const url = `${SPOTIFY_API_URL}/albums/${albumId}`;

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

    const data = (await response.json()) as Album;
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
