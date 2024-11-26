"use server";
import { prisma } from "@/lib/prisma";

export const getAllUsersOnline = async () => {
  const allUserOnline = await prisma.users.findMany({
    where: {
      isOnline: true,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
    },
  });
  return allUserOnline.map((user) => ({
    ...user,
    id: user.id.toString(),
  }));
};
