import { z } from "zod";

export const updateUserSchema = z.object({
  avatar: z.string().optional(),
  password: z.string().optional(),
  new_password: z.string().optional(),
  new_password_confirmation: z.string().optional(),
});
