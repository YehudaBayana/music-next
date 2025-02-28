import { SPOTIFY_API_URL } from '@/utils/constants';
import { GetCurrentlyPlayingTrackResponse } from '../../types';

export const getCurrentPlayback = async (
  accessToken: string
): Promise<GetCurrentlyPlayingTrackResponse | undefined> => {
  const url = `${SPOTIFY_API_URL}/me/player/currently-playing`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Fetch error:', await response.json());
      return undefined;
    }

    const data = await response.json();
    console.log('Currently Playing:', data);
    return data as GetCurrentlyPlayingTrackResponse;
  } catch (error) {
    console.error('Error:', error);
  }
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const session = await getServerSession(req, res, authOptions);

//   if (!session || !session.accessToken) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const accessToken = session.accessToken;

//   const currentlyPlaying = await getCurrentPlayback(accessToken);
//   if (currentlyPlaying) {
//     return res.status(200).json(currentlyPlaying);
//   }
//   return res
//     .status(500)
//     .json({ error: 'Failed to get currently playing, check in server errors' });
// }
