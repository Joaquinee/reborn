"use server";

import { UpdateUser } from "@/interfaces";
import { auth } from "@/lib/auth/auth";
import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";

import bcrypt from "bcryptjs";
import { z } from "zod";

const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  role: z.enum(["ADMIN", "MODERATOR", "SUPPORT", "USER"]),
  avatar: z.string().optional(),
});
export async function updateUser(id: number, data: UpdateUser) {
  const user = await auth();
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (user.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const validatedData = userSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Invalid data" };
  }
  const { username, email, role, avatar } = validatedData.data;

  const getUser = await prisma.users.findUnique({
    where: {
      id,
    },
  });
  if (!getUser) {
    return { error: "User not found" };
  }
  const updatedUser = await prisma.users.update({
    where: {
      id,
    },
    data: {
      username: username,
      email: email,
      avatar: avatar,
    },
  });

  if (!updatedUser) {
    return { error: "Failed to update user" };
  }
  return { success: "User updated" };
}

export async function updatePassword(id: number, password: string) {
  const user = await auth();
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (user.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await prisma.users.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
    },
  });
  if (!updatedUser) {
    return { error: "Failed to update password" };
  }
  return { success: "Password updated" };
}

export async function banOrUnbanUser(id: number, isBanned: boolean) {
  const canAccess = await getUserPermissions(["interact_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const user = await auth();
  if (!user) {
    return { error: "Unauthorized" };
  }
  if (user.user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }
  const updatedUser = await prisma.users.update({
    where: {
      id,
    },
    data: {
      isBanned: isBanned,
    },
  });
  if (!updatedUser) {
    return { error: "Failed to ban or unban user" };
  }
  return { success: "User banned or unbanned" };
}
export async function getUserRolesById(id: number) {
  const userRoles = await prisma.usersRoles.findMany({
    where: { userId: id },
    include: {
      role: true,
    },
  });
  return userRoles;
}

export async function getAllRoles() {
  const allRoles = await prisma.roles.findMany();
  return JSON.parse(JSON.stringify(allRoles));
}

export async function addRoleToUser(userId: number, roleId: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const userRole = await prisma.usersRoles.create({
    data: { userId, roleId },
  });
  if (!userRole) {
    return { error: "Failed to add role to user" };
  }
  return { success: "Role added to user" };
}

export async function removeRoleFromUser(userId: number, roleId: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const userRole = await prisma.usersRoles.delete({
    where: { userId_roleId: { userId, roleId } },
  });
  if (!userRole) {
    return { error: "Failed to remove role from user" };
  }
  return { success: "Role removed from user" };
}
