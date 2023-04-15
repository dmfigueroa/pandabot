import dotenv from "dotenv";
import { Client } from "tmi.js";
import { getToken } from "./get-token.ts";
import { saysPanda } from "./say-panda.ts";

dotenv.config();

const client = new Client({
  channels: ["mikiimoonlight"],
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "soywarmon",
    password: await getToken(),
  },
});

const exclude = ["mikiimoonlight", "soywarmon", "streamelements"];

client.connect().catch(console.error);

console.log("Bot is running");

client.on("message", (channel, tags, message, self) => {
  if (saysPanda(message) && !self && !isExcluded(tags.username)) {
    client.say(channel, `@${tags.username} Cuál Panda?`);
  }
});

const isExcluded = (username: string | undefined) => {
  if (!username) {
    return false;
  }

  return exclude.includes(username.toLowerCase());
};