export const deleteTracksFromPlaylist = async (
  accessToken: string,
  playlistId: string,
  uris: string[],
  snapshot_id: string
) => {
  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const formattedUris = uris.map((uri) => ({ uri }));

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        tracks: formattedUris,
        snapshot_id,
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
