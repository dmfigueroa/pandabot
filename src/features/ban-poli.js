import { banUser } from "../twitch/api.js";
import { hasAllText } from "../utils/index.js";

/**
 * Validates if the message is a valid message to ban Poli
 * @param {string} message The message to evaluate
 */
export const isBanPoli = (message) => {
  return (
    (hasAllText(message, ["ban", "poli"]) ||
      hasAllText(message, ["pan", "boli"]) ||
      hasAllText(message, ["duerman a poli"])) &&
    !hasAllText(message, ["dio", "ban", "poli"])
  );
};

/**
 * Bans Polipelon from the given channel
 *
 * @param {string} channel Channel to ban Poli
 * @returns The response from the Twitch API after banning the user
 */
export const banPoli = async (channel) => {
  const trimmedCHannel = channel.replace("#", "");

  return await banUser(trimmedCHannel, "195438301", 1, "Por ser Poli");
};
