import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTopic } from "@/interfaces";
import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { lockTopic } from "./forum.actions";

interface TopicActionsProps {
  topic: CustomTopic;
  setShowCreatePost: (show: boolean) => void;
}

export default function TopicActions({
  topic,
  setShowCreatePost,
}: TopicActionsProps) {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const handleLockToggle = async () => {
    const response = await lockTopic(
      topic.id.toString(),
      !topic.isLocked,
      topic.categoryId.toString()
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      topic.isLocked = !topic.isLocked;
      toast.success(response.success);
      router.refresh();
    }
  };

  const { data: permission, isLoading: isLoadingPermission } = useQuery({
    queryKey: ["permission", user?.id],
    queryFn: async () => {
      const getPermission = await getUserPermissions(
        [
          `lock_unlock_category_topics_${topic.categoryId}`,
          "interact_dashboard_categories",
        ],
        user?.id
      );
      return getPermission;
    },
    enabled: !!user,
  });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {user && (!topic.isLocked || user.role === "ADMIN") && (
        <Button
          onClick={() => setShowCreatePost(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          <Send className="w-4 h-4 mr-2" />
          Nouveau post
        </Button>
      )}
      <span className="text-sm bg-gray-600 px-3 py-1 rounded-full">
        {topic.posts.length} posts
      </span>
      {user && permission && !isLoadingPermission && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
              <span className="sr-only">Actions du topic</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-50">
            {permission && (
              <DropdownMenuItem
                onSelect={handleLockToggle}
                className={`${
                  topic.isLocked
                    ? "text-green-500 hover:text-green-800"
                    : "text-red-500 hover:text-red-800"
                }`}
              >
                {topic.isLocked ? "Déverrouiller" : "Verrouiller"} le Topic
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>Annuler</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
