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
 * @param {Array<string>=} exclude A list of excluded channels
 * @returns {boolean}
 */
export const isExcluded = (username, exclude) => {
  if (!username) return false;

  return exclude?.includes(username.toLowerCase()) || false;
};
