import { GetAlbumRes } from '@/utils/types';

export const getArtist = async (accessToken: string, artistIds: string[]) => {
  const url = `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`;

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

    const data = (await response.json()) as GetAlbumRes; // TODO: Update the response type
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
