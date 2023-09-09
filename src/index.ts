import { Client } from "tmi.js";
import channels from "../channels.json";
import { banPoli, isBanPoli } from "./ban-poli";
import { getToken } from "./get-token";
import { saysPanda } from "./say-panda";
import app, { port, sigedInEmmiter } from "./server";
import { isExcluded } from "./utils";

console.log("Bot is starting");

console.log("Starting Credentials server");
await new Promise(async (resolve) => {
  Bun.serve({
    port: Number(process.env.PORT) ?? port,
    fetch: app.fetch,
  });
  console.log("Credentials server is running");
  if (!(await getToken()))
    sigedInEmmiter.once("signed-in", () => resolve(null));

  resolve(null);
});

const client = new Client({
  channels: Object.keys(channels),
  connection: { reconnect: true, secure: true },
  identity: {
    username: process.env.MODERATOR_USERNAME,
    password: getToken,
  },
});

console.log("API Client is starting");

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
      if (isBanned) client.say(channel, `@${tags.username} le dio Ban a Poli`);
    }
  }
});
