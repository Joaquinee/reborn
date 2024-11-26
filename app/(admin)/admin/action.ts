"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";

export async function getStats() {
  const canAcces = await getUserPermissions(["view_dashboard"]);
  if (!canAcces) {
    return { error: "Unauthorized" };
  }
  const [
    postsCount,
    commentsCount,
    usersCount,
    lastMonthPostsCount,
    lastMonthCommentsCount,
    lastMonthUsersCount,
  ] = await prisma.$transaction([
    prisma.post.count(),
    prisma.comments.count(),
    prisma.users.count(),
    prisma.post.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          lt: new Date(),
        },
      },
    }),
    prisma.comments.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          lt: new Date(),
        },
      },
    }),
    prisma.users.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          lt: new Date(),
        },
      },
    }),
  ]);

  const calculerPourcentage = (actuel: number, precedent: number) => {
    if (precedent === 0) return actuel > 0 ? 100 : 0;
    return ((actuel - precedent) / precedent) * 100;
  };

  const postsPercentage = calculerPourcentage(postsCount, lastMonthPostsCount);
  const commentsPercentage = calculerPourcentage(
    commentsCount,
    lastMonthCommentsCount
  );
  const usersPercentage = calculerPourcentage(usersCount, lastMonthUsersCount);

  return {
    posts: {
      actuel: postsCount,
      pourcentage: postsPercentage,
    },
    comments: {
      actuel: commentsCount,
      pourcentage: commentsPercentage,
    },
    users: {
      actuel: usersCount,
      pourcentage: usersPercentage,
    },
  };
}
