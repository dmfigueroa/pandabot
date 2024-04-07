import { eq } from "drizzle-orm";
import db, { access } from "../database/index.js";
import { signedInEmitter } from "./auth-server.js";
import * as z from "zod";
import env from "../utils/load-envs.js";
import consola from "consola";

const hostname = env.HOSTNAME_URL;
export const TwitchTokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
});

/**
 * This method gets the current token from database. If the record does not exist it waits for the backend to get one
 * and resolves with the new token
 *
 * @returns {Promise<string>}
 */
export const getToken = async () => {
  let tokens = db.select().from(access).all();

  const access_credentials = tokens[0];

  if (
    !access_credentials ||
    !access_credentials.access_token ||
    !access_credentials.refresh_token
  ) {
    consola.warn(`Open ${hostname}/auth/twitch to sign in`);
    return new Promise((resolve) => {
      signedInEmitter.once("signed-in", async () => {
        tokens = db.select().from(access).all();
        const accessToken = tokens.length > 0 && tokens[0].access_token;

        if (!accessToken) {
          consola.error("Access token not found after created"); // This should never happen
          process.exit();
        }

        resolve(accessToken);
      });
    });
  }

  if (
    !access_credentials.expires_in ||
    access_credentials.expires_in < Date.now()
  ) {
    await refreshTokens(access_credentials.refresh_token);
  }

  return access_credentials.access_token;
};

/**
 * This method updates the token of the user. Basically doing 2 things, updates the values on the database and returns
 * the new string
 *
 * @param {string} refreshToken
 * @returns {Promise<string>} new access token
 */
const refreshTokens = async (refreshToken) => {
  const params = new URLSearchParams();
  params.append("client_id", env.TWITCH_BOT_CLIENT_ID);
  params.append("client_secret", env.TWITCH_BOT_CLIENT_SECRET);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

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
  const parsedData = TwitchTokenResponseSchema.parse(data);

  await updateCredentials({
    access_token: parsedData.access_token,
    refresh_token: parsedData.refresh_token,
    expires_in: parsedData.expires_in,
  });

  return parsedData.access_token;
};

/**
 *
 * @param {string} url The url to authenticate with the given token
 * @param {string} token The token that authenticates the request
 * @param {RequestInit & { params: URLSearchParams }} options The fetch options and the URL query params
 * @returns The response of the fetch method
 */
export const authenticatedFetch = async (url, token, options) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Client-ID", env.TWITCH_BOT_CLIENT_ID ?? "");

  options.headers = headers;

  if (options.params) {
    url += `?${options.params.toString()}`;
  }

  return fetch(url, options);
};

/**
 * Updates the credentials on the database and calls the signedInEmitter
 * @param {z.infer<typeof TwitchTokenResponseSchema>} params
 */
export async function updateCredentials({
  access_token: accessToken,
  refresh_token: refreshToken,
  expires_in: expiresIn,
}) {
  // First access element from db
  const access_credentials = db.select().from(access).all()[0];

  if (!access_credentials) {
    db.insert(access)
      .values({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: Date.now() + expiresIn * 1000,
      })
      .run();
  } else {
    db.update(access)
      .set({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: Date.now() + expiresIn * 1000,
      })
      .where(eq(access.id, access_credentials.id))
      .run();
  }

  signedInEmitter.emit("signed-in");
}
