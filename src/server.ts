import express from "express";

const app = express();

// Endpoint para redirigir al usuario al autenticador de Twitch
app.get("/auth/twitch", (_req, res) => {
  const clientId = process.env.TWITCH_BOT_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "chat:read chat:edit channel:moderate moderator:manage:banned_users",
  });

  res.redirect(`https://id.twitch.tv/oauth2/authorize?${params.toString()}`);
});

// Endpoint para recibir el token OAuth2
app.get("/auth/callback", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;
  const code = req.query.code as string;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
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

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

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
