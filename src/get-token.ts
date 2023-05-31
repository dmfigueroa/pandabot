import dotenv from "dotenv";
import db, { access } from "./database.js";
import { sigedInEmmiter } from "./server.js";
import { eq } from "drizzle-orm";

dotenv.config();

const hostname = process.env.HOSTNAME;

export const getToken = async () => {
  let tokens = db.select().from(access).all();

  if (tokens.length === 0) {
    console.log(`Open ${hostname}/auth/twitch to sign in`);
    return new Promise<string>((resolve) => {
      sigedInEmmiter.once("signed-in", async () => {
        tokens = db.select().from(access).all();

        resolve(tokens[0].access_token);
      });
    });
  }
  const access_credentials = tokens[0];

  console.log(access_credentials.expires_in, Date.now());
  if (access_credentials.expires_in < Date.now()) {
    await refreshTokens(access_credentials.refresh_token);
  }
  return access_credentials.access_token;
};

const refreshTokens = async (refreshToken: string) => {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;
  const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?${params.toString()}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("No se pudo obtener el token OAuth2");
  }

  const data = await response.json();

  await updateCredentials({
    accesToken: data.access_token,
    refreshToken: data.refresh_token,
    expires_in: data.expires_in,
  });

  return data.access_token;
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

export const updateCredentials = async ({
  accesToken,
  refreshToken,
  expires_in: expiresIn,
}) => {
  // Fisrt acces element from db
  const access_credentials = db.select().from(access).all()[0];

  db.update(access)
    .set({
      access_token: accesToken,
      refresh_token: refreshToken,
      expires_in: Date.now() + expiresIn * 1000,
    })
    .where(eq(access.id, access_credentials.id))
    .run();

  sigedInEmmiter.emit("signed-in");
};
