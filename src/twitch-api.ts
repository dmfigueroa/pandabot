import { getToken } from "./get-token.js";
import { channels } from "./index.js";
import type { TitchUser } from "./types/twitch.js";

const TWITCH_API = "https://api.twitch.tv/helix";

export const getUser = async (username: string) => {
  const response = await fetch(`${TWITCH_API}/users?login=${username}`, {
    headers: {
      "Client-ID": process.env.TWITCH_BOT_CLIENT_ID,
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (!response.ok) {
    console.log(await response.json());
    console.error("No se pudo obtener el usuario");
    return null;
  }

  const { data } = (await response.json()) as { data: TitchUser[] };

  return data[0];
};

export const banUser = async (
  channel: string,
  userId: string,
  duration?: number,
  reason?: string
) => {
  const channelId = channels[channel]?.broadcasterId;
  const response = await fetch(
    `${TWITCH_API}/moderation/bans?broadcaster_id=${channelId}&moderator_id=${channels["soywarmon"].broadcasterId}`,
    {
      method: "POST",
      headers: {
        "Client-ID": process.env.TWITCH_BOT_CLIENT_ID,
        Authorization: `Bearer ${await getToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          user_id: userId,
          ...(duration ? { duration } : {}),
          ...(reason ? { reason } : {}),
        },
      }),
    }
  );

  if (!response.ok) {
    return false;
  }

  return true;
};
