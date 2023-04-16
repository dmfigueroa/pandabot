import { spawn } from "node:child_process";
import { RefreshingAuthProvider } from "@twurple/auth";
import { promises as fs } from "fs";

export const permissions = [
  "chat:read",
  "chat:edit",
  "channel:moderate",
  "moderator:manage:banned_users",
];

export const getToken = async () => {
  let messages = "";

  const args = ["token", "-u", "-s", permissions.join(" ")];

  const child = spawn("twitch", args, { stdio: "pipe" });

  child.stdout.on("data", (data) => (messages += data.toString()));
  child.stderr.on("data", (data) => (messages += data.toString()));

  return new Promise(
    (
      resolve: (value: { token: string; refreshToken: string }) => void,
      reject
    ) => {
      child.on("exit", (code) => {
        if (code !== 0)
          return reject(new Error(`Process exited with code ${code}`));

        const token = messages
          .split("\n")
          .find((message) => message.includes("User Access Token:"))
          ?.split(" ")
          .at(-1);

        const refreshToken = messages
          .split("\n")
          .find((message) => message.includes("Refresh Token:"))
          ?.split(" ")
          .at(-1);

        if (!token || !refreshToken) return reject(new Error("No token found"));

        resolve({ token, refreshToken });
      });
    }
  );
};

export const authenticatedFetch = async (
  url: string,
  token: string,
  options: RequestInit & { params?: URLSearchParams }
) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Client-ID", process.env.TWITCH_BOT_CLIENT_ID ?? "");

  options.headers = headers;

  if (options.params) {
    url += `?${options.params.toString()}`;
  }

  return fetch(url, options);
};
