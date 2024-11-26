"use server";

import {
  generateResetPasswordEmail,
  sendResetPasswordEmail,
} from "@/lib/email";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export const sendForgotPassword = async (formData: FormData) => {
  try {
    const data = {
      email: formData.get("email") as string,
    };

    const parsedData = emailSchema.safeParse(data);
    if (!parsedData.success) {
      return { error: parsedData.error.flatten().fieldErrors };
    }

    const user = await prisma.users.findUnique({
      where: {
        email: parsedData.data.email,
      },
    });
    if (!user) {
      return {
        success:
          "Un mail de réinitialisation de mot de passe va être envoyé à cette adresse, veuillez cliquer sur le lien qu'il contient pour continuer..",
      };
    }

    const resetPasswordToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpires = new Date(Date.now() + 3600000);

    await prisma.users.update({
      where: { id: user.id },
      data: { resetPasswordToken, resetPasswordExpires },
    });

    const resetPasswordLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetPasswordToken}`;
    const { text, html } = generateResetPasswordEmail(resetPasswordLink);

    await sendResetPasswordEmail({
      to: parsedData.data.email,
      subject: "Réinitialisation de votre mot de passe",
      text,
      html,
    });

    return {
      success:
        "Un mail de réinitialisation de mot de passe va être envoyé à cette adresse, veuillez cliquer sur le lien qu'il contient pour continuer.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(", ") };
    }
    return { error: (error as Error).message };
  }
};
