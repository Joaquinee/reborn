import { getListPermissionsUser } from "@/lib/auth/getUserPermissions";
import { prisma } from "@/lib/prisma";

interface CommentWithChildren {
  id: number;
  parentId?: number;
  children: CommentWithChildren[];
}

export async function getAllForums() {
  const allCategories = await prisma.category.findMany({
    include: {
      topics: {
        include: {
          posts: {
            include: {
              _count: {
                select: {
                  likes: true,
                  dislikes: true,
                },
              },
              likes: true,
              dislikes: true,
              comments: {
                include: {
                  _count: {
                    select: {
                      likes: true,
                      dislikes: true,
                    },
                  },
                  likes: true,
                  dislikes: true,
                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                      avatar: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  const listPermissions = await getListPermissionsUser();
  allCategories.forEach((category) => {
    if (category.topics && Array.isArray(category.topics)) {
      if (category.public) {
        category.topics = category.topics;
      } else {
        if (listPermissions && listPermissions instanceof Set) {
          category.topics = category.topics.filter(
            (topic) =>
              listPermissions.has(
                `view_category_topics_category_${category.id}`
              ) || listPermissions.has(`interact_dashboard_categories`)
          );
        } else {
          category.topics = [];
        }
      }
    } else {
      category.topics = [];
    }
  });

  const filteredCategories = allCategories.filter(
    (category) => category.topics && category.topics.length > 0
  );

  filteredCategories.forEach((category) => {
    category.topics.forEach((topic) => {
      topic.posts.forEach((post) => {
        const commentMap = new Map();
        post.comments.forEach((comment) => {
          const typedComment = comment as unknown as CommentWithChildren;
          typedComment.children = [];
          commentMap.set(typedComment.id, typedComment);
        });
        post.comments = post.comments.filter((comment) => {
          if (comment.parentId) {
            const parentComment = commentMap.get(comment.parentId);
            if (parentComment) {
              parentComment.children.push(comment);
              return false;
            }
          }
          return true;
        });
      });
    });
  });
  return JSON.parse(JSON.stringify(filteredCategories));
}
