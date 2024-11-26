"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { zodSchemaLikes } from "@/lib/zod/forums";

async function handleLikeDislike(
  action: "like" | "dislike",
  items: "post" | "comments",
  id: string
) {
  if (!items || !id) return;
  const user = await auth();
  if (!user) return { error: "Vous n'êtes pas connecté" };
  const validation = zodSchemaLikes.safeParse({ items, id });
  if (!validation.success) {
    return { error: "Données invalides", details: validation.error.errors };
  }
  const { items: itemsValue, id: idValue } = validation.data;
  const userId = Number(user.user.id);

  switch (itemsValue) {
    case "post":
      const resPost = await prisma.post.findUnique({
        where: { id: Number(idValue) },
      });
      if (!resPost) return { error: "Le post n'existe pas" };

      if (action === "like") {
        const existingLike = await prisma.postLike.findUnique({
          where: {
            userId_postId: {
              userId: userId,
              postId: Number(idValue),
            },
          },
        });
        if (existingLike) {
          await prisma.postLike.delete({
            where: {
              userId_postId: {
                userId: userId,
                postId: Number(idValue),
              },
            },
          });
        } else {
          await prisma.postLike.create({
            data: {
              postId: Number(idValue),
              userId: userId,
            },
          });
        }
      } else {
        const existingDislike = await prisma.postDislike.findUnique({
          where: {
            userId_postId: {
              userId: userId,
              postId: Number(idValue),
            },
          },
        });
        if (existingDislike) {
          await prisma.postDislike.delete({
            where: {
              userId_postId: {
                userId: userId,
                postId: Number(idValue),
              },
            },
          });
        } else {
          await prisma.postDislike.create({
            data: {
              postId: Number(idValue),
              userId: userId,
            },
          });
        }
      }
      break;

    case "comments":
      const resComments = await prisma.comments.findUnique({
        where: { id: Number(idValue) },
      });
      if (!resComments) return { error: "Comment not found" };

      if (action === "like") {
        const existingCommentLike = await prisma.commentLike.findUnique({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: Number(idValue),
            },
          },
        });
        if (existingCommentLike) {
          await prisma.commentLike.delete({
            where: {
              userId_commentId: {
                userId: userId,
                commentId: Number(idValue),
              },
            },
          });
        } else {
          await prisma.commentLike.create({
            data: {
              commentId: Number(idValue),
              userId: userId,
            },
          });
        }
      } else {
        const existingCommentDislike = await prisma.commentDislike.findUnique({
          where: {
            userId_commentId: {
              userId: userId,
              commentId: Number(idValue),
            },
          },
        });
        if (existingCommentDislike) {
          await prisma.commentDislike.delete({
            where: {
              userId_commentId: {
                userId: userId,
                commentId: Number(idValue),
              },
            },
          });
        } else {
          await prisma.commentDislike.create({
            data: {
              commentId: Number(idValue),
              userId: userId,
            },
          });
        }
      }
      break;
  }
}
export async function likesItems(items: "post" | "comments", id: string) {
  console.log("like");
  await handleLikeDislike("like", items, id);
  return {
    success: true,
  };
}

export async function dislikesItems(items: "post" | "comments", id: string) {
  console.log("dislike");
  await handleLikeDislike("dislike", items, id);
  return {
    success: true,
  };
}
