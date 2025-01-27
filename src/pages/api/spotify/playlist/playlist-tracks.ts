import { NextApiRequest, NextApiResponse } from "next";
import { getTracks } from "@/utils/spotifyApi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { playlistId, offset } = req.query;

  if (!playlistId || !offset) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const tracks = await getTracks(
      playlistId as string,
      session.accessToken,
      parseInt(offset as string)
    );

    res
      .status(200)
      .json({ newTracks: tracks, hasMoreServer: tracks.length > 0 });
  } catch (err) {
    console.error("Error fetching paginated tracks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
