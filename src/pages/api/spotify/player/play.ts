import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export const playOnSpotify = async (
  data: {
    accessToken: string;
    uris?: string[];
    context_uri?: string;
    offset?: {
      position: number;
    };
    position_ms?: number;
  },
  deviceId?: string
) => {
  const url =
    "https://api.spotify.com/v1/me/player/play" +
    (deviceId ? `?device_id=${deviceId}` : "");
  console.log("url ", url);

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Fetch error:", await response.json());
      return;
    }

    console.log("Playback started successfully");
  } catch (error) {
    console.error("Error:", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = session.accessToken;
  const data = req.body;

  await playOnSpotify({ accessToken, ...data }, data.deviceId);

  return res.status(200).json({ message: "Playback started" });
}
