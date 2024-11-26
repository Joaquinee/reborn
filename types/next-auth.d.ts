import "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
    avatar?: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: User & {
      id: string;
      username?: string;
      avatar?: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    avatar?: string;
    isAdmin?: boolean;
  }
}
