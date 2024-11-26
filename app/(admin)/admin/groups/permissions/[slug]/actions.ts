"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";
export async function getAllPermissions(roleId: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const permissions = await prisma.permissions.findMany({});
  const getRolePermissions = await prisma.rolePermissions.findMany({
    where: {
      roleId: Number(roleId),
    },
  });
  return JSON.parse(
    JSON.stringify(
      permissions.map((p) => ({
        ...p,
        active: getRolePermissions.some((rp) => rp.permissionId === p.id),
      }))
    )
  );
}

export async function getRoles(roleId: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const roles = await prisma.roles.findMany({
    where: {
      id: roleId,
    },
  });
  return JSON.parse(JSON.stringify(roles));
}

export async function togglePermission(
  roleId: number,
  permissionId: number,
  active: boolean
) {
  const canAccess = await getUserPermissions(["interact_dashboard_groups"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  if (active) {
    await prisma.rolePermissions.create({
      data: {
        roleId,
        permissionId,
      },
    });
  } else {
    await prisma.rolePermissions.deleteMany({
      where: {
        roleId,
        permissionId,
      },
    });
  }
}
