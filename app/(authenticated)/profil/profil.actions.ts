"use server";

import { auth } from "@/lib/auth/auth";
import { checkPassword, updateUserPassword } from "@/lib/database/users";
import { prisma } from "@/lib/prisma";
import { unlink, writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";

const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function updateUserAvatar(file: File) {
  try {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error(
        "Type de fichier non autorisé. Utilisez JPG, PNG ou WebP."
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Le fichier est trop volumineux. Taille maximum: 5MB");
    }

    const session = await auth();
    if (!session?.user) throw new Error("Utilisateur non trouvé");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const currentUser = await prisma.users.findUnique({
      where: { id: Number(session.user.id) },
      select: { avatar: true },
    });

    const fileName = `avatar-${
      session.user.id
    }-${Date.now()}${file.name.substring(file.name.lastIndexOf("."))}`;
    const uploadDir = join(process.cwd(), "uploads", "images", "avatars");
    const path = join(uploadDir, fileName);

    await writeFile(path, buffer);

    if (currentUser?.avatar && currentUser.avatar !== "v0_57.png") {
      const oldAvatarPath = join(
        process.cwd(),
        "uploads",
        "images",
        "avatars",
        currentUser.avatar
      );
      try {
        await unlink(oldAvatarPath);
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'ancien avatar:",
          error
        );
      }
    }

    const avatarPath = `/uploads/images/avatars/${fileName}`;
    await prisma.users.update({
      where: { id: Number(session.user.id) },
      data: { avatar: fileName },
    });

    revalidatePath("/profil");
    return {
      path: `/api/avatars/${fileName}`,
      fileName: fileName,
    };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error);
    throw error instanceof Error
      ? error
      : new Error("Échec de la mise à jour de l'avatar");
  }
}

export async function confirmPassword(formData: FormData) {
  const { current_password, new_password, new_password_confirmation } =
    Object.fromEntries(formData.entries());

  const session = await auth();
  if (!session?.user) throw new Error("User not found");

  const user = await prisma.users.findUnique({
    where: { id: Number(session.user.id) },
    select: { password: true, email: true },
  });

  if (!user) throw new Error("User not found");
  if (!user.password) throw new Error("User password not found");

  const isPasswordValid = await checkPassword(
    user.email,
    String(current_password)
  );

  if (!isPasswordValid) {
    throw new Error("Mot de passe actuel incorrect");
  }

  if (new_password !== new_password_confirmation) {
    throw new Error("Les mots de passe ne correspondent pas");
  }

  if (!new_password || String(new_password).length < 1) {
    throw new Error("Le nouveau mot de passe ne peut pas être vide");
  }

  await updateUserPassword(Number(session.user.id), String(new_password));

  const testLogin = await checkPassword(user.email, String(new_password));

  if (!testLogin) {
    throw new Error("La mise à jour du mot de passe a échoué");
  }

  revalidatePath("/profil");
  return "Mot de passe mis à jour avec succès";
}

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user) throw new Error("User not found");
  return session.user;
}
