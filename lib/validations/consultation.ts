 // lib/validations/consultation.ts
import { z } from "zod";

export const consultationUpsertSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
});
