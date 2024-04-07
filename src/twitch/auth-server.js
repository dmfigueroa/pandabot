import EventEmitter from "events";
import { Hono } from "hono";
import { TwitchTokenResponseSchema, updateCredentials } from "./get-token.js";
import env from "../utils/load-envs.js";
import consola from "consola";

const app = new Hono();

export const signedInEmitter = new EventEmitter();

const scopes = [
  "chat:read",
  "chat:edit",
  "channel:moderate",
  "channel:manage:moderators",
  "moderator:manage:banned_users",
  "user:read:email",
];

const REDIRECT_URI = env.HOSTNAME_URL + "/auth/callback";

// Endpoint to redirect the user to the Twitch auth page
app.get("/auth/twitch", (context) => {
  const clientId = env.TWITCH_BOT_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId || "",
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: scopes.join(" "),
  });

  return context.redirect(
    `https://id.twitch.tv/oauth2/authorize?${params.toString()}`
  );
});

// Endpoint para recibir el token OAuth2
app.get("/auth/callback", async (context) => {
  const code = context.req.query("code");

  if (!code || typeof code !== "string") {
    context.status(400);
    return context.text("Código de autorización no válido");
  }

  const params = new URLSearchParams();
  params.append("client_id", env.TWITCH_BOT_CLIENT_ID);
  params.append("client_secret", env.TWITCH_BOT_CLIENT_SECRET);
  params.append("code", code);
  params.append("grant_type", "authorization_code");
  params.append("redirect_uri", REDIRECT_URI);

  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?${params.toString()}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo obtener el token OAuth2");
    }

    const data = TwitchTokenResponseSchema.parse(await response.json());

    await updateCredentials({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });

    return context.text(
      "¡Autenticación exitosa! Puedes cerrar esta ventana ahora."
    );
  } catch (error) {
    consola.error("There was an error obtaining the OAuth2 token:", error);
    context.status(500);
    return context.text(
      "Error al obtener el token OAuth2. Por favor, inténtalo de nuevo."
    );
  }
});

// Iniciar el servidor
export const port = 3000;

export default app;
