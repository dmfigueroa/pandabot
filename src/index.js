import { serve } from "@hono/node-server";
import consola from "consola";
import { Client } from "tmi.js";
import { banPoli, isBanPoli } from "./features/ban-poli.js";
import { saysPanda } from "./features/say-panda.js";
import app, { port } from "./twitch/auth-server.js";
import { getToken } from "./twitch/get-token.js";
import channels from "./utils/channels.js";
import { isExcluded } from "./utils/index.js";
import env from "./utils/load-envs.js";

consola.info("Bot is starting");

consola.info("Starting Credentials server");
serve({ port: Number(env.PORT) || port, fetch: app.fetch });
consola.info("Credentials server is running");

const client = new Client({
  channels: Object.keys(channels),
  connection: { reconnect: true, secure: true },
  identity: {
    username: env.MODERATOR_USERNAME,
    password: getToken,
  },
});

consola.info("API Client is starting");

client.connect().catch(consola.error);

consola.info("Bot is running");

client.on("message", async (channel, tags, message, self) => {
  if (self) return;
  if (!tags.username) return;
  const trimmedChannel = channel.replace("#", "");
  const channelInfo = channels[trimmedChannel];
  if (!channelInfo) return;
  if (isExcluded(tags.username, channelInfo.exclude)) return;
  if (message.toLowerCase() === "ping") {
    client.say(channel, "pong");
  }
  if (channelInfo.features.includes("cualPanda") && saysPanda(message)) {
    client.say(channel, `@${tags.username} Cuál Panda?`);
  }

  if (channelInfo.features.includes("banPoli") && isBanPoli(message)) {
    const isBanned = await banPoli(trimmedChannel);
    if (isBanned) client.say(channel, `@${tags.username} le dio Ban a Poli`);
  }
});
