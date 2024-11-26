"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";

export const getInfoUsers = async (userId: string) => {
  const canAccess = await getUserPermissions(["interact_dashboard_users"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }

  if (!userId) {
    return null;
  }
  const [user, posts, comments] = await prisma.$transaction([
    prisma.users.findUnique({
      where: { id: Number(userId) },

      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        },
      },
    }),
    prisma.post.findMany({ where: { userId: Number(userId) } }),
    prisma.comments.findMany({ where: { userId: Number(userId) } }),
  ]);

  if (!user) {
    return null;
  }
  return { user, posts, comments };
};
