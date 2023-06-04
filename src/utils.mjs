/**
 * Checks if the given text contains all of the specified words.
 * @param {string} text - The text to check for the words.
 * @param {string[]} words - An array of words to check for in the text.
 * @returns {boolean} - Returns true if the text contains all of the specified words, otherwise false.
 */
export const hasAllText = (text, words) => {
  return words.every((word) => text.toLowerCase().includes(word));
};
