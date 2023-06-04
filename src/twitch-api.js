/**
 * @typedef {import('./types/api.types.js').TitchUser} TwitchUser
 */

import { getToken } from "./get-token.mjs";
import { channels } from "./index.js";

const TWITCH_API = "https://api.twitch.tv/helix";

/**
 * Retrieves information about a Twitch user by their username.
 * @param {string} username - The username of the Twitch user.
 * @returns {Promise<TwitchUser | null>} - A Promise that resolves with the user's information or null if the user is not found.
 */
export const getUser = async (username) => {
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

/**
 * Bans a user from a Twitch channel.
 * @param {string} channel - The name of the Twitch channel.
 * @param {string} userId - The ID of the user to be banned.
 * @param {number | undefined} duration - The duration of the ban in seconds. If not provided, the ban will be permanent.
 * @param {string | undefined} reason - The reason for the ban.
 * @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the ban was successful.
 */
export const banUser = async (channel, userId, duration, reason) => {
  const channelId = channels[channel]?.broadcasterId;
  const headers = new Headers();
  headers.append("Client-ID", process.env.TWITCH_BOT_CLIENT_ID ?? "");
  headers.append("Authorization", `Bearer ${await getToken()}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(
    `${TWITCH_API}/moderation/bans?broadcaster_id=${channelId}&moderator_id=${channels["soywarmon"].broadcasterId}`,
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
