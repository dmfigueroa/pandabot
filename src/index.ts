import dotenv from "dotenv";
import { Client } from "tmi.js";
import { saysPanda } from "./say-panda.js";
import { getToken } from "./get-token.js";
import app, { port } from "./server.js";

dotenv.config();

console.log("Bot is starting");

console.log("Starting Credentials server");
await new Promise((resolve) => {
  app.listen(Number(process.env.PORT) ?? port, "0.0.0.0", null, () => {
    console.log("Credentials server is running");
    resolve(null);
  });
});

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

console.log("API Client is starting");

const exclude = ["mikiimoonlight", "streamelements"];

client.connect().catch(console.error);

console.log("Bot is running");

client.on("message", async (channel, tags, message, self) => {
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
