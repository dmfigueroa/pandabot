export const saysPanda = (message: string) => {
  if (
    message.toLowerCase().includes("cual panda") ||
    message.toLowerCase().includes("cuál panda")
  ) {
    return false;
  }

  if (message.toLowerCase().includes("panda")) {
    return true;
  }

  if (message.toLowerCase().includes("pandita")) {
    return true;
  }

  return false;
};
