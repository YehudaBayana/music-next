import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../pages/api/auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { thisDeviceName } from '@/utils/constants';
import { Device, GetAlbumRes, MyPlaylistItem } from '@/utils/types';

export const getPlaylist = async (accessToken: string, playlistId: string) => {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

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

        const data = (await response.json()) as MyPlaylistItem;
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};
