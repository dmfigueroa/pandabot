import { banUser } from "./twitch-api.js";

export const isBanPoli = (text: string): boolean => {
  return (
    text.toLowerCase().includes("ban a poli") ||
    text.toLowerCase().includes("pan a boli") ||
    (text.toLowerCase().includes("ban") && text.toLowerCase().includes("poli"))
  );
};

export const banPoli = async (channel: string) => {
  const trimmedCHannel = channel.replace("#", "");

  return await banUser(trimmedCHannel, "195438301", 1, "Por ser Poli");
};
