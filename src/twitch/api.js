/**
 * @typedef {import("../../types").TwitchUser} TwitchUser
 */

import { getToken } from "./get-token.js";
import channels from "../utils/channels.js";
import env from "../utils/load-envs.js";
import consola from "consola";

const TWITCH_API = "https://api.twitch.tv/helix";

/**
 *
 * @param {string} username
 * @returns {Promise<TwitchUser | null>}
 */
export const getUser = async (username) => {
  const headers = new Headers();
  headers.append("Client-ID", env.TWITCH_BOT_CLIENT_ID);
  headers.append("Authorization", `Bearer ${await getToken()}`);
  const response = await fetch(`${TWITCH_API}/users?login=${username}`, {
    headers,
  });

  if (!response.ok) {
    consola.error(`There was an error obtaining ${username}'s data`);
    return null;
  }

  const { data } = await response.json();

  return data[0];
};

/**
 * Bans a user from a given channel on Twitch
 *
 * @param {string} channel Channel where the user is going to be banned from
 * @param {string} userId user to ban
 * @param {number | undefined} duration The amount of time the user will be banned from the channel
 * @param {string} reason The reason why the user is banned
 * @returns Boolean that says if the user was banned or not
 */
export const banUser = async (channel, userId, duration, reason) => {
  const channelId = channels[channel]?.broadcasterId;
  const headers = new Headers();
  headers.append("Client-ID", env.TWITCH_BOT_CLIENT_ID);
  headers.append("Authorization", `Bearer ${await getToken()}`);
  headers.append("Content-Type", "application/json");

  const moderatorUserId = channels[env.MODERATOR_USERNAME].broadcasterId;

  if (!moderatorUserId) throw new Error("You need to add the moderator to the channels list");

  const response = await fetch(
    `${TWITCH_API}/moderation/bans?broadcaster_id=${channelId}&moderator_id=${moderatorUserId}`,
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
    },
  );

  return response.ok;
};
