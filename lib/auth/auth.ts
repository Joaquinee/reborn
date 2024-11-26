import authConfig from "@/lib/auth/auth.config";
import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    generateSessionToken: () => {
      return crypto.randomUUID();
    },
    maxAge: 60 * 60 * 24 * 30,
  },
  ...authConfig,
  trustHost: true,
});
