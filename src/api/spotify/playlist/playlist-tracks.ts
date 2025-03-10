// import { buildEndpoint } from '@/utils/utils';
// import { spotifyApi, SpotifyApiGetEndpoints } from '@/utils/spotifyApi';
// import { GetPlaylistTracksRes } from '@/utils/types';

// export const getPlaylistTrackss = async (
//   id: string,
//   accessToken: string,
//   offset: number = 0,
//   limit: number = 20 // Default Spotify limit for pagination
// ): Promise<{
//   newTracks: (Spotify.Track | Spotify.Episode)[];
//   hasMoreServer: boolean;
// }> => {
//   const endpoint = buildEndpoint('/playlists/{playlist_id}/tracks', {
//     playlist_id: id,
//   }) as SpotifyApiGetEndpoints;

//   const queryParams = `?offset=${offset}&limit=${limit}`;

//   try {
//     const res = await spotifyApi.get<GetPlaylistTracksRes>(
//       `${endpoint}${queryParams}` as SpotifyApiGetEndpoints,
//       accessToken || ''
//     );
//     const tracks = res.items.map((item) => item.track);
//     return { newTracks: tracks, hasMoreServer: tracks.length > 0 };
//   } catch (error) {
//     console.error('Error fetching tracks:', error);
//     return { newTracks: [], hasMoreServer: false };
//   }
// };
