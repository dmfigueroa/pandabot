import consola from "consola";
import "dotenv/config";
import { z } from "zod";

const env = z
  .object({
    PORT: z.string().optional(),
    MODERATOR_USERNAME: z.string(),
    TWITCH_BOT_CLIENT_ID: z.string(),
    HOSTNAME_URL: z.string(),
    TWITCH_BOT_CLIENT_SECRET: z.string(),
  })
  .safeParse(process.env);

if (!env.success) {
  consola.error(
    "Invalid environment variables: ",
    env.error.flatten().fieldErrors
  );
  process.exit();
}

export default env.data;
