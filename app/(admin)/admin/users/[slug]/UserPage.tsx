"use client";
import { Button } from "@/components/ui/button";
import { UserContent } from "@/components/User/UserContent";
import { UserProfile } from "@/components/User/UserProfile";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UserDetailPage({ user }: { user: any }) {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la liste
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        <UserProfile user={user.user} />
        <UserContent posts={user.posts} comments={user.comments} />
      </div>
    </div>
  );
}
