import { z } from "zod";

export const emailSchema = z.string().email({
  message: "E-mail invalide !",
});
export const passwordSchema = z.string().min(1, {
  message: "Mot de passe invalide !",
});
