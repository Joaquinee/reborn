"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";
import { Topic } from "@prisma/client";
import { z } from "zod";
export async function getCategoryBySlug(slug: string) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const category = await prisma.category.findUnique({
    where: { id: Number(slug) },
    include: {
      topics: true,
    },
  });

  return category;
}

const zTopic = z.object({
  id: z.number().optional(),
  title: z.string(),
  content: z.string(),
  categoryId: z.number(),
  isLocked: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  order: z.number().optional(),
});
export async function createTopic(topic: Topic) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }

  const parsedTopic = zTopic.safeParse(topic);
  if (!parsedTopic.success) {
    return {
      error: "Invalid topic data",
    };
  }
  const { id, ...topicData } = parsedTopic.data;
  const topicCount = await prisma.topic.count({
    where: {
      categoryId: topicData.categoryId,
    },
  });
  topicData.order = topicCount;
  const newTopic = await prisma.topic.create({
    data: topicData,
  });

  return newTopic;
}

export async function updateTopicOrder(id: number, order: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  return await prisma.topic.update({
    where: { id },
    data: { order },
  });
}

export async function deleteTopic(id: number) {
  if (!id) {
    return { error: "Invalid topic id" };
  }
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  return await prisma.topic.delete({
    where: { id },
  });
}

export async function updateTopic(topic: Topic) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const parsedTopic = zTopic.safeParse(topic);
  if (!parsedTopic.success) {
    return { error: "Invalid topic data" };
  }
  return await prisma.topic.update({
    where: { id: topic.id },
    data: topic,
  });
}

export async function lockTopic(id: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const updatedTopic = await prisma.topic.update({
    where: { id },
    data: { isLocked: true },
  });
  if (updatedTopic) {
    return updatedTopic;
  }
  return { error: "Failed to lock topic" };
}
