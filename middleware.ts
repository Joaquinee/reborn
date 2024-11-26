import { auth } from "@/lib/auth/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const session = await auth();

  const signInRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
  ];

  const userRoutes = ["/profil"];

  if (signInRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if ((pathname.startsWith("/admin") && !session?.user.isAdmin) || false) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (userRoutes.includes(pathname) && !session?.user) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
