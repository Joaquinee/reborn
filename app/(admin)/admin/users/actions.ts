"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";
import { Users } from "@prisma/client";

import bcrypt from "bcryptjs";
import { z } from "zod";

export async function getUsers() {
  const canAccess = await getUserPermissions(["view_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const users = await prisma.users.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      createdAt: true,
    },
  });
  return users;
}

const zodUser = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
});
export async function createUser(user: Users) {
  const canAccess = await getUserPermissions(["interact_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const parsedData = zodUser.safeParse(user);
  if (!parsedData.success) {
    return { error: "Invalid data" };
  }

  const existingEmail = await prisma.users.findUnique({
    where: {
      email: parsedData.data.email,
    },
  });

  if (existingEmail) {
    return { error: "Cet email est déjà utilisé" };
  }

  const existingUsername = await prisma.users.findUnique({
    where: {
      username: parsedData.data.username,
    },
  });

  if (existingUsername) {
    return { error: "Ce nom d'utilisateur est déjà utilisé" };
  }

  const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

  const newUser = await prisma.users.create({
    data: {
      username: parsedData.data.username,
      email: parsedData.data.email,
      password: hashedPassword,
    },
  });
  if (!newUser) {
    return { error: "Failed to create user" };
  }
  return { success: "User created" };
}

export async function deleteUser(id: string) {
  const canAccess = await getUserPermissions(["interact_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const deletedUser = await prisma.users.delete({
    where: {
      id: Number(id),
    },
  });
  if (!deletedUser) {
    return { error: "Failed to delete user" };
  }
  return { success: "User deleted" };
}
