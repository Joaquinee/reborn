"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";
import { Prisma, Roles } from "@prisma/client";

export async function getAllRoles() {
  const groups = await prisma.roles.findMany({
    orderBy: {
      order: "asc",
    },
  });
  return groups;
}

export async function deleteRole(roleId: string) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  if (Number(roleId) === 1) {
    return { error: "Impossible de supprimer le groupe Admin" };
  }
  const deletedUsers = await prisma.usersRoles.deleteMany({
    where: {
      roleId: Number(roleId),
    },
  });
  const deletedRole = await prisma.roles.delete({
    where: { id: Number(roleId) },
  });
  if (deletedRole) {
    return { success: true };
  } else {
    return { error: "Role non trouvé" };
  }
}
export async function createRole(role: Roles) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  if (!role.name) {
    return { error: "Nom du groupe requis" };
  }
  if (!role.color) {
    return { error: "Couleur du groupe requis" };
  }
  const order = await prisma.roles.count();

  try {
    const createdRole = await prisma.roles.create({
      data: {
        ...role,
        order,
      },
    });
    if (createdRole) {
      return { success: true };
    } else {
      return { error: "Role non créé" };
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[]) || [];
      if (target.includes("name")) {
        return { error: "Ce nom de groupe est déjà pris" };
      }
    }
    return { error: "Une erreur inattendue s'est produite" };
  }
}
export async function updateRoleOrder(roleId: number, order: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const updatedRole = await prisma.roles.update({
    where: { id: roleId },
    data: {
      order,
    },
  });
  if (updatedRole) {
    return { success: true };
  } else {
    return { error: "Role non modifié" };
  }
}
export async function updateRole(roleId: number, role: Roles) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const updatedRole = await prisma.roles.update({
    where: {
      id: roleId,
    },
    data: {
      name: role.name,
      color: role.color,
      staff: role.staff,
    },
  });
  if (updatedRole) {
    return { success: true };
  } else {
    return { error: "Role non modifié" };
  }
}
