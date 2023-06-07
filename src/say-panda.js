import { hasAllText } from "./utils.mjs";

/**
 * Determines if a message contains the word "panda" or "pandita".
 * @param {string} message - The message to check.
 * @returns {boolean} - True if the message contains "panda" or "pandita", false otherwise.
 */
export const saysPanda = (message) => {
  if (
    hasAllText(message, ["cual panda"]) ||
    hasAllText(message, ["cuál panda"])
  ) {
    return false;
  }

  return hasAllText(message, ["panda"]) || hasAllText(message, ["pandita"]);
};
