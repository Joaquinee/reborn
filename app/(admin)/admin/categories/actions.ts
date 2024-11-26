"use server";

import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
export interface Category {
  id: number;
  name: string;
  order: number;
  slug: string;
  description: string;
}
const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  order: z.number().optional(),
  public: z.boolean().optional(),
});

export async function getCategories() {
  const canAccess = await getUserPermissions(["view_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      order: true,
      slug: true,
      public: true,
      description: true,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function updateCategoryOrder(id: number, order: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  return await prisma.category.update({
    where: { id },
    data: { order },
  });
}

export async function updateCategory(category: Category) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const validatedCategory = categorySchema.safeParse(category);
  if (!validatedCategory.success) {
    return { error: "Invalid category data" };
  }
  return await prisma.category.update({
    where: { id: category.id },
    data: category,
  });
}

export async function createCategory(category: Category) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }
  const validatedCategory = categorySchema.safeParse(category);
  if (!validatedCategory.success) {
    return { error: "Invalid category data" };
  }
  const categoryCount = await prisma.category.count();
  const { id, ...categoryDataWithoutId } = validatedCategory.data;
  const newCategory = await prisma.category.create({
    data: {
      ...categoryDataWithoutId,
      order: categoryCount,
    },
    select: {
      id: true,
      name: true,
      order: true,
      slug: true,
      public: true,
      description: true,
    },
  });
  if (!newCategory) {
    return { error: "Failed to create category" };
  }

  const permissions = [
    {
      name: `view_category_topics_category_${newCategory.id}`,
      description: `Voir les topics & posts de ${newCategory.name}`,
    },

    {
      name: `lock_unlock_post_category_${newCategory.id}`,
      description: `Pouvoir locker / unlock un post dans ${newCategory.name}`,
    },
    {
      name: `lock_unlock_category_topics_${newCategory.id}`,
      description: `Pouvoir locker / unlocker les topics de ${newCategory.name}`,
    },
    {
      name: `create_post_category_${newCategory.id}`,
      description: `Pouvoir crée un post dans ${newCategory.name}`,
    },

    {
      name: `update_post_category_${newCategory.id}`,
      description: `Pouvoir editer un post dans ${newCategory.name}`,
    },

    {
      name: `delete_post_category_${newCategory.id}`,
      description: `Pouvoir supprimer un post dans ${newCategory.name}`,
    },

    {
      name: `create_comment_post_category_${newCategory.id}`,
      description: `Pouvoir ajouter un commentaire dans un post sur ${newCategory.name}`,
    },

    {
      name: `update_comment_post_category_${newCategory.id}`,
      description: `Pouvoir editer un commentaire dans un post sur ${newCategory.name}`,
    },

    {
      name: `delete_comment_post_category_${newCategory.id}`,
      description: `Pouvoir supprimer un commentaire dans un post sur ${newCategory.name}`,
    },
  ];
  const createdPermissions = await prisma.$transaction(
    permissions.map((permission) =>
      prisma.permissions.create({
        data: {
          ...permission,
          categoryId: newCategory.id,
        },
      })
    )
  );
  const adminRole = await prisma.roles.findFirst({
    where: { id: 1 },
  });
  if (!adminRole) {
    return { error: "Admin role not found" };
  }
  if (adminRole) {
    await prisma.$transaction(
      createdPermissions.map((permission) =>
        prisma.rolePermissions.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        })
      )
    );
  }

  return newCategory;
}

export async function deleteCategory(id: number) {
  const canAccess = await getUserPermissions(["interact_dashboard_categories"]);
  if (!canAccess) {
    return { error: "Unauthorized" };
  }

  const deleteAll = await prisma.$transaction([
    prisma.permissions.deleteMany({
      where: { categoryId: id },
    }),
    prisma.category.delete({
      where: { id },
    }),
  ]);
  return deleteAll;
}
