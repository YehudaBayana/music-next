// import { buildEndpoint } from '@/utils/utils';
// import { spotifyApi, SpotifyApiGetEndpoints } from '@/utils/spotifyApi';
// import {  GetPlaylistTracksRes, Track } from '@/utils/types';

// export const getAlbumTracks = async (
//   id: string,
//   accessToken: string
//   // offset: number = 0,
//   // limit: number = 20 // Default Spotify limit for pagination
// ): Promise<{
//   newTracks: (Spotify.Track | Spotify.Episode) [];
//   hasMoreServer: boolean;
// }> => {
//   const endpoint = buildEndpoint('/albums/{album_id}/tracks', {
//     album_id: id,
//   }) as SpotifyApiGetEndpoints;

//   const queryParams = ''; // `?offset=${offset}&limit=${limit}`;

//   try {
//     const res = await spotifyApi.get<GetAlbumTracksRes>(
//       `${endpoint}${queryParams}` as SpotifyApiGetEndpoints,
//       accessToken || ''
//     );
//     const tracks = res.items;
//     return { newTracks: tracks, hasMoreServer: tracks.length > 0 };
//   } catch (error) {
//     console.error('Error fetching tracks:', error);
//     return { newTracks: [], hasMoreServer: false };
//   }
// };
