import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import type { NextApiRequest, NextApiResponse } from 'next';
import { thisDeviceName } from '@/utils/constants';
import { Device } from '@/utils/types';

export const getAvailableDevices = async (accessToken: string) => {
  const url = 'https://api.spotify.com/v1/me/player/devices';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      console.error('Error fetching devices:', await response.json());
      return null;
    }

    const data = await response.json();
    // console.log('Available Devices:', data);

    // Extract the devices list
    const devices = data.devices;

    // Find your specific device (if applicable)
    const yourDevice = devices.find(
      (device: Device) => device.name === thisDeviceName
    );

    if (!yourDevice) {
      console.log('Your application device not found.');
      return devices[0].id;
    }

    console.log('Your Device ID:', yourDevice.id);
    return yourDevice.id;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const accessToken = session.accessToken;

  const deviceRes = await getAvailableDevices(accessToken);
  if (deviceRes) {
    return res.status(200).json(deviceRes);
  }
  return res
    .status(500)
    .json({ error: 'Failed to get devices, check in server errors' });
}
