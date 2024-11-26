import "@/app/globals.css";
import { Sidebar } from "@/components/Admin/Sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RebornRP - Dashboard",
  description: "Panel d'administration",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row h-svh overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
