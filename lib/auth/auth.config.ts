// authConfig.ts ou le fichier où vous avez défini votre configuration NextAuth
import { prisma } from "@/lib/prisma";
import { signInSchema } from "@/lib/zod/login";
import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUserPermissions } from "./getUserPermissions";

export const authConfig = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = signInSchema.safeParse(credentials);

          if (!parsedCredentials.success) {
            return null;
          }

          const { email, password } = parsedCredentials.data;

          const user = await prisma.users.findFirst({
            where: { email },
          });

          if (!user || !user.password) {
            return null;
          }
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          const isAdmin = await getUserPermissions(
            ["view_dashboard"],
            user.id.toString()
          );
          return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
            isAdmin: isAdmin,
            avatar: user.avatar ?? undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.avatar = user.avatar;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.avatar = token.avatar as string | undefined;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
} satisfies NextAuthConfig;

export default authConfig;
