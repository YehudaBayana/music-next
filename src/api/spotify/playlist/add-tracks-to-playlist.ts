export const addTracksToPlaylist = async (
  accessToken: string | undefined,
  playlistId: string,
  uris: string[]
) => {
  if (!accessToken) {
    throw new Error('no access token to add tracks to playlist');
  }
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        uris,
        position: 0,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};
