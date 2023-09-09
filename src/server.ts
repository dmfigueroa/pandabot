import EventEmitter from "events";
import { Hono } from "hono";
import { updateCredentials } from "./get-token";

const app = new Hono();

export const sigedInEmmiter = new EventEmitter();

const scopes = [
  "chat:read",
  "chat:edit",
  "channel:moderate",
  "channel:manage:moderators",
  "moderator:manage:banned_users",
  "user:read:email",
];

const REDIRECT_URI = process.env.HOSTNAME_URL + "/auth/callback";

// Endpoint para redirigir al usuario al autenticador de Twitch
app.get("/auth/twitch", (context) => {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;

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
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;
  const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;
  const code = context.req.query("code");

  if (!code || typeof code !== "string") {
    context.status(400);
    return context.text("Código de autorización no válido");
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId ?? "");
  params.append("client_secret", clientSecret ?? "");
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

    const data = await response.json();

    await updateCredentials({
      accesToken: data.access_token,
      refreshToken: data.refresh_token,
      expires_in: data.expires_in,
    });

    // Aquí puedes hacer lo que desees con el token de acceso y el token de actualización
    // Por ejemplo, puedes almacenarlos en una base de datos o utilizarlos para autenticar al usuario

    return context.text(
      "¡Autenticación exitosa! Puedes cerrar esta ventana ahora."
    );
  } catch (error) {
    console.error("Error al obtener el token OAuth2:", error);
    context.status(500);
    return context.text(
      "Error al obtener el token OAuth2. Por favor, inténtalo de nuevo."
    );
  }
});

// Iniciar el servidor
export const port = 3000;

export default app;
