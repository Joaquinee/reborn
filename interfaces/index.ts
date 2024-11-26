import {
  Category,
  CommentDislike,
  CommentLike,
  Comments,
  Post,
  PostDislike,
  PostLike,
  Roles,
  Topic,
  Users,
} from "@prisma/client";

export type CustomUsers = Pick<Users, "id" | "username" | "avatar"> & {
  role?: Pick<Roles, "id" | "name" | "color">;
};
export type CustomUserOnline = Pick<Users, "id" | "username" | "avatar">;

export type UpdateUser = Pick<
  Users,
  "id" | "username" | "avatar" | "email" | "password"
>;

export type CustomComment = Comments & {
  likes: CommentLike[];
  dislikes: CommentDislike[];
  user: CustomUsers;
  children: CustomComment[];
  _count: {
    likes: number;
    dislikes: number;
  };
  parentId?: number | null;
};

export type CustomPost = Post & {
  user: CustomUsers;
  comments: (CustomComment & {
    children: CustomComment[];
  })[];
  likes: PostLike[];
  dislikes: PostDislike[];
  _count: {
    comments: number;
    likes: number;
    dislikes: number;
  };
};

export type CustomTopic = Topic & {
  posts: (CustomPost & {
    comments: (CustomComment & {
      children: CustomComment[];
    })[];
    likes: PostLike[];
    dislikes: PostDislike[];
  })[];
  _count: {
    posts: number;
  };
};

export type CustomForum = Category & {
  topics: (CustomTopic & {
    _count: {
      posts: number;
    };
  })[];
  _count: {
    topics: number;
  };
};

export type CustomLike = Pick<PostLike | CommentLike, "userId">;

export type StaffRoleWithUsers = {
  order: number;
  name: string;
  color: string;
  users: {
    username: string;
    avatar: string;
  }[];
};
