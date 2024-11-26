import { emailSchema } from "@/lib/zod/globals";
import { z } from "zod";

export const signUpSchema = z.object({
  email: emailSchema,
  username: z.string().min(1),
  password: z.string().min(1),
  password_confirmation: z.string().min(1),
});
