import { z } from "zod";

export const zodSchemaLikes = z.object({
  items: z.enum(["post", "comments"]),
  id: z.string().min(1),
});
export const zodSchemaForum = z.object({
  message: z.string().min(1).max(4000).trim(),
  postId: z.string().regex(/^\d+$/),
  parentId: z.string().regex(/^\d+$/).optional(),
  categoryId: z.string(),
});
export const zodSchemaCreatePost = z.object({
  title: z.string().min(3).max(200).trim(),
  content: z.string().min(1).max(50000).trim(),
  topicId: z.string().regex(/^\d+$/),
  categoryId: z.string(),
});
