import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import db, { access } from "./database.js";
import { sigedInEmmiter } from "./server.js";

dotenv.config();

const hostname = process.env.HOSTNAME_URL;

export const getToken = async () => {
  let tokens = db.select().from(access).all();

  const access_credentials = tokens[0];

  if (
    !access_credentials ||
    !access_credentials.access_token ||
    !access_credentials.refresh_token
  ) {
    console.log(`Open ${hostname}/auth/twitch to sign in`);
    return new Promise((resolve) => {
      sigedInEmmiter.once("signed-in", async () => {
        tokens = db.select().from(access).all();

        resolve(tokens[0].access_token);
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
 * Refreshes the access token using the provided refresh token.
 * @param {string} refreshToken - The refresh token to use for refreshing the access token.
 * @returns {Promise<string>} - A promise that resolves with the new access token.
 */
const refreshTokens = async (refreshToken) => {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;
  const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;

  const params = new URLSearchParams();
  params.append("client_id", clientId ?? "");
  params.append("client_secret", clientSecret ?? "");
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

  await updateCredentials({
    accesToken: data.access_token,
    refreshToken: data.refresh_token,
    expires_in: data.expires_in,
  });

  return data.access_token;
};

/**
 * Sends an authenticated HTTP request to the specified URL using the provided access token.
 * @param {string} url - The URL to send the request to.
 * @param {string} token - The access token to use for authentication.
 * @param {object} options - Additional options to include in the request (e.g. headers, body, etc.).
 * @returns {Promise<Response>} - A promise that resolves with the response from the server.
 */
export const authenticatedFetch = async (url, token, options) => {
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Client-ID", process.env.TWITCH_BOT_CLIENT_ID ?? "");

  options.headers = headers;

  if (options.params) {
    url += `?${options.params.toString()}`;
  }

  return fetch(url, options);
};

/**
 * Updates the access and refresh tokens in the database with the provided values.
 * @param {object} credentials - An object containing the new access and refresh tokens, and the expiration time of the access token.
 * @param {string} credentials.accesToken - The new access token.
 * @param {string} credentials.refreshToken - The new refresh token.
 * @param {number} credentials.expires_in - The expiration time of the access token, in seconds.
 * @returns {Promise<void>} - A promise that resolves when the tokens have been updated in the database.
 */
export async function updateCredentials({
  accesToken,
  refreshToken,
  expires_in: expiresIn,
}) {
  // Fisrt acces element from db
  const access_credentials = db.select().from(access).all()[0];

  if (!access_credentials) {
    db.insert(access)
      .values({
        access_token: accesToken,
        refresh_token: refreshToken,
        expires_in: Date.now() + expiresIn * 1000,
      })
      .run();
  } else {
    db.update(access)
      .set({
        access_token: accesToken,
        refresh_token: refreshToken,
        expires_in: Date.now() + expiresIn * 1000,
      })
      .where(eq(access.id, access_credentials.id))
      .run();
  }

  sigedInEmmiter.emit("signed-in");
}
