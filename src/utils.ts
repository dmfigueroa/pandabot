import exclude from "../exclude.json";

export const hasAllText = (text: string, words: string[]): boolean => {
  return words.every((word) => text.toLowerCase().includes(word.toLowerCase()));
};

export const isExcluded = (username: string | undefined): boolean => {
  if (!username) return false;

  return exclude.includes(username.toLowerCase());
};
