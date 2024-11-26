"use server";
import { auth } from "@/lib/auth/auth";
import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";
import { zodSchemaCreatePost, zodSchemaForum } from "@/lib/zod/forums";

export async function SendMessage(
  message: string,
  postId: string,
  parentId?: string,
  categoryId?: string
) {
  const canAccess = await getUserPermissions([
    `create_comment_post_category_${categoryId}`,
    "interact_dashboard_categories",
  ]);
  if (!canAccess) return { error: "Unauthorized" };

  try {
    const validation = zodSchemaForum.safeParse({
      message,
      postId,
      parentId,
      categoryId,
    });

    if (!validation.success) {
      return { error: "Données invalides", details: validation.error.errors };
    }

    const user = await auth();
    if (!user?.user?.id) {
      return { error: "Vous n'êtes pas connecté" };
    }

    const userPermissions = await getUserPermissions([
      `create_category_post_comment_${categoryId}`,
      "interact_dashboard_categories",
    ]);
    if (!userPermissions) return { error: "Vous n'avez pas les permissions" };

    const getPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      select: { id: true, isLocked: true },
    });

    if (!getPost) return { error: "Le post n'existe pas" };
    if (getPost.isLocked) return { error: "Ce post est verrouillé" };

    const addComment = await prisma.comments.create({
      data: {
        content: validation.data.message,
        postId: Number(validation.data.postId),
        parentId: validation.data.parentId
          ? Number(validation.data.parentId)
          : null,
        userId: Number(user.user.id),
      },
    });

    if (!addComment) {
      return { error: "Erreur lors de l'ajout du commentaire" };
    }

    const userResult = await prisma.users.findUnique({
      where: { id: Number(user.user.id) },
      select: { username: true, avatar: true, id: true },
    });

    if (!userResult) return { error: "L'utilisateur n'existe pas" };

    const comment = {
      content: String(addComment.content),
      createdAt: addComment.createdAt,
      dislikes: [],
      id: addComment.id.toString(),
      likes: [],
      parentId: addComment.parentId?.toString(),
      postId: addComment.postId.toString(),
      updatedAt: addComment.updatedAt,
      userId: userResult.id.toString(),
      user: userResult,
      _count: { dislikes: 0, likes: 0 },
    };

    return { success: "Commentaire ajouté avec succès", comment };
  } catch (error) {
    console.error("SendMessage error:", error);
    return { error: "Une erreur interne est survenue" };
  }
}

export async function createPost(
  title: string,
  content: string,
  topicId: string,
  categoryId: string
) {
  const canAccess = await getUserPermissions([
    `create_post_category_${categoryId}`,
    `interact_dashboard_categories`,
  ]);
  if (!canAccess) return { error: "Unauthorized" };

  try {
    const validation = zodSchemaCreatePost.safeParse({
      title,
      content,
      topicId,
      categoryId,
    });
    if (!validation.success) {
      return { error: "Données invalides", details: validation.error.errors };
    }

    const user = await auth();
    if (!user?.user?.id) {
      return { error: "Vous n'êtes pas connecté" };
    }

    const userPermissions = await getUserPermissions([
      `create_category_post_${categoryId}`,
      "interact_dashboard_categories",
    ]);
    if (!userPermissions) return { error: "Vous n'avez pas les permissions" };

    const getTopic = await prisma.topic.findUnique({
      where: { id: Number(topicId) },
      select: { id: true, isLocked: true },
    });

    if (!getTopic) return { error: "Le sujet n'existe pas" };
    if (getTopic.isLocked && user.user.role !== "ADMIN") {
      return { error: "Le sujet est verrouillé" };
    }

    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
      if (typeof parsedContent !== "object" || Array.isArray(parsedContent)) {
        return { error: "Format de contenu invalide" };
      }
    } catch (error) {
      return { error: "Contenu JSON invalide" };
    }

    const addPost = await prisma.post.create({
      data: {
        title: validation.data.title,
        content: parsedContent,
        userId: Number(user.user.id),
        topicId: getTopic.id,
      },
    });

    if (!addPost) return { error: "Erreur lors de l'ajout du post" };
    return { success: "Post ajouté avec succès", post: addPost };
  } catch (error) {
    console.error("createPost error:", error);
    return { error: "Une erreur interne est survenue" };
  }
}

export async function lockTopic(
  topicId: string,
  isLocked: boolean,
  categoryId: string
) {
  const userPermissions = await getUserPermissions([
    `interact_category_topics_${categoryId}`,
    "interact_dashboard_categories",
  ]);
  if (!userPermissions) return { error: "Unauthorized" };

  const updateTopic = await prisma.topic.update({
    where: { id: Number(topicId) },
    data: { isLocked },
  });
  if (!updateTopic) return { error: "Erreur lors de la mise à jour du sujet" };
  return { success: "Sujet mis à jour avec succès" };
}

export async function lockPost(
  postId: string,
  isLocked: boolean,
  categoryId: string
) {
  const userPermissions = await getUserPermissions([
    `lock_unlock_post_category_${categoryId}`,
    "interact_dashboard_categories",
  ]);
  if (!userPermissions) return { error: "Unauthorized" };

  const updatePost = await prisma.post.update({
    where: { id: Number(postId) },
    data: { isLocked },
  });
  if (!updatePost) return { error: "Erreur lors de la mise à jour du post" };
  return { success: "Post mis à jour avec succès" };
}

export async function deleteComment(commentId: string, categoryId: string) {
  const userPermissions = await getUserPermissions([
    `delete_comment_post_category_${categoryId}`,
    "interact_dashboard_categories",
  ]);
  if (!userPermissions) return { error: "Unauthorized" };

  await prisma.comments.deleteMany({
    where: { parentId: Number(commentId) },
  });

  const deleteComment = await prisma.comments.delete({
    where: { id: Number(commentId) },
  });
  if (!deleteComment)
    return { error: "Erreur lors de la suppression du commentaire" };

  return { success: "Commentaire supprimé avec succès" };
}
export async function deletePost(postId: string, categoryId: string) {
  const userPermissions = await getUserPermissions([
    `delete_category_post_${categoryId}`,
    "interact_dashboard_categories",
  ]);
  if (!userPermissions) return { error: "Vous n'avez pas les permissions" };

  const deletePost = await prisma.post.delete({
    where: { id: Number(postId) },
  });
  const deleteComments = await prisma.comments.deleteMany({
    where: { postId: Number(postId) },
  });
  if (!deletePost || !deleteComments)
    return { error: "Erreur lors de la suppression du post" };

  return { success: "Post supprimé avec succès" };
}
