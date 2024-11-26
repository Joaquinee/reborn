import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema } from "@/lib/zod/register";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { z } from "zod";

export async function getUserByEmail(email: string) {
  return await prisma.users.findUnique({
    where: { email },
  });
}

export async function getUserByCredentials(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) return false;
  const hashedPassword = user.password;
  const isMatch = await bcrypt.compare(password, hashedPassword);
  if (isMatch) {
    return user;
  }
  return false;
}

export async function checkPassword(
  username: string,
  password: string
): Promise<boolean> {
  const user = await getUserByEmail(username);
  if (!user) return false;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
}

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const createUser = async (data: z.infer<typeof signUpSchema>) => {
  const { email, password, username } = data;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        email: String(email),
        password: String(hashedPassword),
        username: String(username),
      },
    });
    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[]) || [];
      if (target.includes("username")) {
        return { error: "Ce nom d'utilisateur est déjà pris" };
      }
      if (target.includes("email")) {
        return { error: "Cet email est déjà utilisé" };
      }
    }
    return { error: "Une erreur inattendue s'est produite" };
  }
};

export async function getUserById() {
  const session = await auth();
  if (!session || !session.user) return null;
  return await prisma.users.findUnique({
    where: { id: Number(session.user.id) },
  });
}

export async function updateUserPassword(id: number, password: string) {
  if (!password || password.length < 1) {
    throw new Error("Le mot de passe ne peut pas être vide");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { password: hashedPassword },
    });
    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe:", error);
    throw new Error("Impossible de mettre à jour le mot de passe");
  }
}

export async function getOnlineUsers() {
  const onlineUsers = await prisma.users.findMany({
    where: { isOnline: true },
    select: { id: true, username: true, avatar: true },
  });
  return onlineUsers;
}
