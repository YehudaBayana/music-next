import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { catchError } from "@/utils/utils";

export const previousTrackRequest = async (
  data: {
    accessToken: string;
    position_ms: number;
  },
  deviceId?: string
) => {
  const url = `https://api.spotify.com/v1/me/player/seek?position_ms=${
    data.position_ms
  }${deviceId ? `&device_id=${deviceId}` : ""}`;
  console.log("url ", url);

  const [error] = await catchError(
    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        "Content-Type": "application/json",
      },
    })
  );
  if (error) {
    return console.log("yuda error", error);
  }
  console.log("Playback previous successfully");
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

  await previousTrackRequest({ accessToken, ...data }, data.deviceId);

  return res.status(200).json({ message: "Playback previous" });
}
