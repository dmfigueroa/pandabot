import { hasAllText } from "../utils/index.js";

/**
 * Validates if the message is a valid message to use the "cualPanda" feature
 * @param {string} message The message to evaluate
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
