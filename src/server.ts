import dotenv from "dotenv";
import EventEmitter from "events";
import express from "express";
import { updateCredentials } from "./get-token.js";

dotenv.config();
const app = express();

export const sigedInEmmiter = new EventEmitter();

const REDIRECT_URI = process.env.HOSTNAME_URL + "/auth/callback";

// Endpoint para redirigir al usuario al autenticador de Twitch
app.get("/auth/twitch", (_req, res) => {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "chat:read chat:edit channel:moderate moderator:manage:banned_users",
  });

  res.redirect(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
});

// Endpoint para recibir el token OAuth2
app.get("/auth/callback", async (req, res) => {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;
  const clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;
  const code = req.query.code as string;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: REDIRECT_URI,
  });

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

    res.send("¡Autenticación exitosa! Puedes cerrar esta ventana ahora.");
  } catch (error) {
    console.error("Error al obtener el token OAuth2:", error);
    res
      .status(500)
      .send("Error al obtener el token OAuth2. Por favor, inténtalo de nuevo.");
  }
});

// Iniciar el servidor
export const port = 3000;

export default app;
