"use server";

import { StaffRoleWithUsers } from "@/interfaces";
import { prisma } from "@/lib/prisma";

export const getListStaff = async (): Promise<StaffRoleWithUsers[]> => {
  const roles = await prisma.roles.findMany({
    where: {
      staff: true,
    },
    include: {
      userRoles: {
        include: {
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return roles.map((role) => ({
    order: role.order,
    name: role.name,
    color: role.color,
    users: role.userRoles.map((userRole) => ({
      username: userRole.user.username,
      avatar: userRole.user.avatar || "",
    })),
  }));
};
