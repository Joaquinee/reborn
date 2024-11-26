import { TooltipProvider } from "@/components/ui/tooltip";
import UserContextProvider from "@/context/AuthContext";
import { auth } from "@/lib/auth";
import TanstackProvider from "@/providers/TanstackProvider";
import { OnlineStatusManager } from "@/task/online/OnlineStatus";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Reborn",
  description: "Site du server RebornRP",
  authors: { name: "RebornRP", url: "https://rebornrp.fr" },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider
          session={session}
          refetchInterval={1000}
          refetchOnWindowFocus={true}
        >
          <UserContextProvider session={session}>
            <TooltipProvider>
              <TanstackProvider>{children}</TanstackProvider>
              {session?.user.id && (
                <OnlineStatusManager userId={session?.user.id} />
              )}
            </TooltipProvider>
          </UserContextProvider>
        </SessionProvider>
        <Toaster richColors closeButton position="bottom-right" />
      </body>
    </html>
  );
}
