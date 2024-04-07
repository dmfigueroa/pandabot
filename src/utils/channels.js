import { z } from "zod";
import importValidatedJson from "./import-json.js";

const channelsSchema = z.record(
  z.string(),
  z.object({
    features: z.array(z.enum(["cualPanda", "banPoli"])),
    isPoliMod: z.boolean().optional(),
    broadcasterId: z.string(),
  })
);

export default await importValidatedJson("channels.json", channelsSchema);
