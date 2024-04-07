import { z } from "zod";
import importValidatedJson from "./import-json.js";

const exclude = await importValidatedJson("exclude.json", z.array(z.string()));

/**
 * Evaluates if a text contains any of the strings on the words array
 *
 * @param {string} text The text to evaluate
 * @param {string[]} words List of words
 */
export const hasAllText = (text, words) => {
  return words.every((word) => text.toLowerCase().includes(word.toLowerCase()));
};

/**
 * Validates if a username is listed in the exclude file
 * @param {string} username
 * @returns {boolean}
 */
export const isExcluded = (username) => {
  if (!username) return false;

  return exclude.includes(username.toLowerCase());
};
