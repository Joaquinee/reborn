import { auth } from "@/lib/auth/auth";
import { notFound } from "next/navigation";
import ProfilEdit from "./profil.page";

export default async function ProfilePage() {
  const user = await auth();
  if (!user) return notFound();
  return <ProfilEdit />;
}
