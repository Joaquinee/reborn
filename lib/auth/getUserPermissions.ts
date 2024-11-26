"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserPermissions(
  requiredPermissions: string[],
  userId?: string
) {
  let user;
  if (userId) {
    user = await prisma.users.findUnique({ where: { id: Number(userId) } });
  } else {
    user = await auth();
    user = await prisma.users.findUnique({
      where: { id: Number(user?.user.id) },
    });
  }
  if (!user) {
    return false;
  }
  try {
    const userWithPermissions = await prisma.users.findUnique({
      where: { id: Number(user.id) },
      select: {
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                staff: true,
                color: true,
                order: true,
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true,
                        category: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) {
      return false;
    }

    const permissions = new Set(
      userWithPermissions.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.name)
      )
    );

    return requiredPermissions.some((permission) =>
      permissions.has(permission)
    );
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des permissions de l'utilisateur:",
      error
    );
    return false;
  }
}

export const getListPermissionsUser = async () => {
  const user = await auth();
  if (!user) {
    return false;
  }
  try {
    const userWithPermissions = await prisma.users.findUnique({
      where: { id: Number(user.user.id) },
      select: {
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                staff: true,
                color: true,
                order: true,
                rolePermissions: {
                  select: {
                    permission: {
                      select: {
                        id: true,
                        name: true,
                        category: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userWithPermissions) {
      return false;
    }

    const permissions = new Set(
      userWithPermissions.userRoles.flatMap((ur) =>
        ur.role.rolePermissions.map((rp) => rp.permission.name)
      )
    );
    return permissions;
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }
};
