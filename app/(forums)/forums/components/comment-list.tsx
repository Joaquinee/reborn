import ButtonLikes from "@/components/Editor/buttonLikes/ButtonLikes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeUser } from "@/components/User/UserRoles";
import { CustomComment, CustomPost, CustomTopic } from "@/interfaces";
import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Send, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import CommentForm from "./comment-form";

interface CommentListProps {
  comments: CustomComment[];
  onCommentSubmit: (content: string, parentId?: string) => void;
  onDeleteComment: (commentId: string) => void;
  topic: CustomTopic;
  post: CustomPost;
}

export default function CommentList({
  comments,
  onCommentSubmit,
  onDeleteComment,
  topic,
  post,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { data: session } = useSession();
  const user = session?.user;
  console.log(comments);

  const { data: permission, isLoading: isLoadingPermission } = useQuery({
    queryKey: ["permission", user?.id],
    queryFn: async () => {
      const getPermission = await getUserPermissions(
        [
          `delete_comment_post_category_${topic.categoryId}`,
          "interact_dashboard_categories",
        ],
        user?.id
      );
      return getPermission;
    },
    enabled: !!user,
  });

  const getParentsContent = (comment: CustomComment) => {
    const parentComment = comments.find((c) => c.id === comment.parentId);
    return parentComment;
  };
  const renderComment = (comment: CustomComment, isChild = false) => {
    const childComments = comment.children || [];
    return (
      <div
        key={comment.id}
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${
          isChild ? "ml-4 mt-4" : "mb-4"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Image
              className="rounded-full border border-gray-200"
              src={
                `/api/avatars/${comment.user?.avatar}` ||
                "/uploads/images/avatars/v0_57.png"
              }
              alt={`Avatar de ${comment.user.username}`}
              width={isChild ? 32 : 40}
              height={isChild ? 32 : 40}
              style={{
                width: `${isChild ? "32px" : "40px"}`,
                height: `${isChild ? "32px" : "40px"}`,
              }}
            />
            <div className="flex flex-col gap-2">
              <h5 className="font-semibold text-gray-900">
                {comment.user.username}
              </h5>
              <BadgeUser userId={comment.user.id.toString()} />
            </div>
          </div>
          {user && permission && !isLoadingPermission && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => onDeleteComment(comment.id.toString())}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {isChild && (
          <p className="text-xs text-gray-500 italic mb-2">
            En réponse à {getParentsContent(comment)?.user.username}
          </p>
        )}
        <div
          className="text-gray-700 mb-2"
          dangerouslySetInnerHTML={{
            __html: comment.content as string,
          }}
        />
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-xs text-gray-500">
            Publié le {new Date(comment.createdAt).toLocaleDateString()}
          </span>
          <ButtonLikes
            likes={comment._count.likes}
            dislikes={comment._count.dislikes}
            likeArray={comment.likes}
            dislikeArray={comment.dislikes}
            itemsID={comment.id.toString()}
            type="comments"
          />
        </div>
        {!isChild && (
          <>
            {childComments.map((childComment) =>
              renderComment(childComment, true)
            )}
            {replyingTo === comment.id.toString() ? (
              <div className="mt-4">
                <CommentForm
                  parentId={
                    comment.parentId?.toString() || comment.id.toString()
                  }
                  categoryId={topic.categoryId.toString()}
                  onSubmit={onCommentSubmit}
                  setReplyingTo={setReplyingTo}
                />
              </div>
            ) : (
              user &&
              !topic.isLocked &&
              !post.isLocked && (
                <button
                  onClick={() => setReplyingTo(comment.id.toString())}
                  className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span className="font-medium">Répondre</span>
                </button>
              )
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {comments
        .slice()
        .reverse()
        .map((comment) => renderComment(comment))}
    </div>
  );
}
