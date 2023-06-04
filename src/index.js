import dotenv from "dotenv";
import { Client } from "tmi.js";
import { banPoli, isBanPoli } from "./ban-poli.js";
import { getToken } from "./get-token.mjs";
import { saysPanda } from "./say-panda.js";
import app, { port } from "./server.js";

dotenv.config();

console.log("Bot is starting");

console.log("Starting Credentials server");
await new Promise((resolve) => {
  app.listen(Number(process.env.PORT) ?? port, "0.0.0.0", 0, () => {
    console.log("Credentials server is running");
    resolve(null);
  });
});

export const channels = {
  mikiimoonlight: {
    isPoliMod: false,
    broadcasterId: "808750879",
  },
  soywarmon: {
    isPoliMod: true,
    broadcasterId: "54643022",
  },
};

const client = new Client({
  channels: Object.keys(channels),
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: "soywarmon",
    password: getToken,
  },
});

console.log("API Client is starting");

const exclude = ["streamelements"];

client.connect().catch(console.error);

console.log("Bot is running");

client.on("message", async (channel, tags, message, self) => {
  if (self || isExcluded(tags.username)) return;
  if (saysPanda(message)) {
    client.say(channel, `@${tags.username} Cuál Panda?`);
  }
  if (isBanPoli(message)) {
    const trimmedChannel = channel.replace("#", "");
    const isPoliMod = !!channels[trimmedChannel]?.isPoliMod;
    if (!isPoliMod) {
      const isBanned = await banPoli(trimmedChannel);
      if (isBanned) {
        client.say(channel, `@${tags.username} le dio Ban a Poli`);
      }
    }
  }
});

/**
 * Checks if a username is excluded from bot commands.
 * @param {string | undefined} username - The username to check.
 * @returns {boolean} - True if the username is excluded, false otherwise.
 */
const isExcluded = (username) => {
  if (!username) {
    return false;
  }

  return exclude.includes(username.toLowerCase());
};
