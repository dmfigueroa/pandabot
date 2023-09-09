import { hasAllText } from "./utils";

export const saysPanda = (message: string): boolean => {
  if (
    hasAllText(message, ["cual panda"]) ||
    hasAllText(message, ["cuál panda"])
  ) {
    return false;
  }

  return hasAllText(message, ["panda"]) || hasAllText(message, ["pandita"]);
};
