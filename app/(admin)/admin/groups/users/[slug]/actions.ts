"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";

export async function getUsers(roleId: string) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const users = await prisma.usersRoles.findMany({
    where: {
      roleId: Number(roleId),
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });
  return users;
}

export async function deleteRolesAtUsers(userId: number, roleId: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }

  const user = await prisma.usersRoles.delete({
    where: { userId_roleId: { userId, roleId } },
  });
  if (!user) {
    return { error: "Utilisateur non trouvé" };
  }
  return { success: "Utilisateur supprimé" };
}

export async function getAllUsers() {
  const users = await prisma.users.findMany();
  if (!users) {
    return { error: "Utilisateurs non trouvés" };
  }
  return JSON.parse(JSON.stringify(users));
}

export async function addUserToRole(userId: number, roleId: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  if (!userId || !roleId) {
    return { error: "Veuillez sélectionner un utilisateur et un groupe" };
  }
  const user = await prisma.usersRoles.create({ data: { userId, roleId } });
  if (!user) {
    return { error: "Utilisateur non trouvé" };
  }
  return { success: "Utilisateur ajouté" };
}
