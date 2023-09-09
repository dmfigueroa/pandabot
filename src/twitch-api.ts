import { getToken } from "./get-token";
import channels from "../channels.json";

export type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  email: string;
  created_at: string;
};

const TWITCH_API = "https://api.twitch.tv/helix";

export const getUser = async (username: string): Promise<TwitchUser | null> => {
  const headers = new Headers();
  headers.append("Client-ID", process.env.TWITCH_BOT_CLIENT_ID ?? "");
  headers.append("Authorization", `Bearer ${await getToken()}`);
  const response = await fetch(`${TWITCH_API}/users?login=${username}`, {
    headers,
  });

  if (!response.ok) {
    console.log(await response.json());
    console.error("No se pudo obtener el usuario");
    return null;
  }

  const { data } = await response.json();

  return data[0];
};

export const banUser = async (
  channel: string,
  userId: string,
  duration: number | undefined,
  reason: string | undefined
): Promise<boolean> => {
  const channelId = channels[channel]?.broadcasterId;
  const headers = new Headers();
  headers.append("Client-ID", process.env.TWITCH_BOT_CLIENT_ID ?? "");
  headers.append("Authorization", `Bearer ${await getToken()}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(
    `${TWITCH_API}/moderation/bans?broadcaster_id=${channelId}&moderator_id=${
      channels[process.env.MODERATOR_USERNAME as string].broadcasterId
    }`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: {
          user_id: userId,
          ...(duration ? { duration } : {}),
          ...(reason ? { reason } : {}),
        },
      }),
    }
  );

  return response.ok;
};
