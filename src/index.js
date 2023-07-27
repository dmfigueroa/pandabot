import dotenv from "dotenv";
import { Client } from "tmi.js";
import { banPoli, isBanPoli } from "./ban-poli.js";
import { getToken } from "./get-token.mjs";
import { saysPanda } from "./say-panda.js";
import app, { port, sigedInEmmiter } from "./server.js";

dotenv.config();

console.log("Bot is starting");

console.log("Starting Credentials server");
await new Promise((resolve) => {
  app.listen(Number(process.env.PORT) ?? port, "0.0.0.0", 0, async () => {
    console.log("Credentials server is running");
    if (!(await getToken())) {
      sigedInEmmiter.once("signed-in", async () => {
        resolve(null);
      });
    }
    resolve(null);
  });
});

export const channels = {
  mikiimoonlight: {
    isPoliMod: false,
    broadcasterId: "808750879",
    features: ["cualPanda", "banPoli"],
  },
  soywarmon: {
    isPoliMod: true,
    broadcasterId: "54643022",
    features: ["cualPanda", "banPoli"],
  },
  cymaniatico: {
    isPoliMod: false,
    broadcasterId: "12823826",
    features: ["banPoli"],
  },
  moonyvt: {
    isPoliMod: false,
    broadcasterId: "908667217",
    features: ["banPoli"],
  },
  niikasauria: {
    isPoliMod: false,
    broadcasterId: 165821521,
    features: ["banPoli"],
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
  const trimmedChannel = channel.replace("#", "");
  if (self || isExcluded(tags.username)) return;
  if (message.toLowerCase() === "ping") {
    client.say(channel, "pong");
  }
  if (
    channels[trimmedChannel]?.features.includes("cualPanda") &&
    saysPanda(message)
  ) {
    client.say(channel, `@${tags.username} Cuál Panda?`);
  }

  if (
    channels[trimmedChannel]?.features.includes("banPoli") &&
    isBanPoli(message)
  ) {
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
