export const hasAllText = (text: string, words: string[]): boolean => {
  return words.every((word) => text.toLowerCase().includes(word.toLowerCase()));
};
