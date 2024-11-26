import { emailSchema, passwordSchema } from "@/lib/zod/globals";
import { z } from "zod";

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
