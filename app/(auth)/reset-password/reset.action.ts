"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
});

export const resetPasswordAction = async (
  formData: FormData,
  token: string | null
) => {
  try {
    const data = {
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const parsedData = resetPasswordSchema.safeParse(data);
    if (!parsedData.success) {
      return { error: parsedData.error.flatten().fieldErrors };
    }

    if (!token) {
      return { error: "Token de réinitialisation manquant" };
    }

    const user = await prisma.users.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user || !user.resetPasswordExpires || !user.resetPasswordToken) {
      return { error: "Token de réinitialisation invalide ou expiré" };
    }
    if (user.resetPasswordExpires < new Date()) {
      return { error: "Le token de réinitialisation a expiré" };
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { success: "Votre mot de passe a été réinitialisé avec succès" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: (error as Error).message };
  }
};
