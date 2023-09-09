import { banUser } from "./twitch-api";
import { hasAllText } from "./utils";

export const isBanPoli = (message: string) => {
  return (
    (hasAllText(message, ["ban", "poli"]) ||
      hasAllText(message, ["pan", "boli"]) ||
      hasAllText(message, ["duerman a poli"])) &&
    !hasAllText(message, ["dio", "ban", "poli"])
  );
};

export const banPoli = async (channel: string) => {
  const trimmedCHannel = channel.replace("#", "");

  return await banUser(trimmedCHannel, "195438301", 1, "Por ser Poli");
};
