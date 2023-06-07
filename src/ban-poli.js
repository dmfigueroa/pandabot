import { banUser } from "./twitch-api.js";
import { hasAllText } from "./utils.mjs";

/**
 * Checks if the given text contains a request to ban Polipelon.
 * @param {string} message - The text to check for a ban request.
 * @returns {boolean} - Returns true if the text contains a ban request for Polipelon, otherwise false.
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
 * Bans Polipelon from the specified channel for 1 second with the reason "Por ser Poli".
 * @param {string} channel - The name of the channel to ban the user from.
 * @returns {Promise<boolean>} - A Promise that resolves when the user has been banned.
 */
export const banPoli = async (channel) => {
  const trimmedCHannel = channel.replace("#", "");

  return await banUser(trimmedCHannel, "195438301", 1, "Por ser Poli");
};
