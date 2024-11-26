"use server";

import { createUser } from "@/lib/database/users";
import { signUpSchema } from "@/lib/zod/register";
import { z } from "zod";

export const signUp = async (data: z.infer<typeof signUpSchema>) => {
  const parsedCredentials = signUpSchema.safeParse(data);

  if (!parsedCredentials.success) {
    return {
      error: parsedCredentials.error.flatten().fieldErrors,
    };
  }
  try {
    const user = await createUser(data);
    if ("error" in user) {
      return {
        error: user.error,
      };
    }
    return {
      success: "Votre compte a été créé avec succès",
    };
  } catch (error) {
    return {
      error: `Une erreur est survenue lors de l'enregistrement ${error}`,
    };
  }
};
