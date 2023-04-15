import { spawn } from "node:child_process";

export const getToken = async () => {
  let messages = "";

  const args = ["token", "-u", "-s", "chat:read chat:edit channel:moderate"];

  const child = spawn("twitch", args, { stdio: "pipe" });

  child.stdout.on("data", (data) => (messages += data.toString()));
  child.stderr.on("data", (data) => (messages += data.toString()));

  return new Promise((resolve: (value: string) => void, reject) => {
    child.on("exit", (code) => {
      if (code !== 0)
        return reject(new Error(`Process exited with code ${code}`));

      const tokenMessage = messages
        .split("\n")
        .find((message) => message.includes("User Access Token:"));

      if (!tokenMessage) return reject(new Error("No token found"));

      resolve(tokenMessage.split(" ").at(-1));
    });
  });
};
