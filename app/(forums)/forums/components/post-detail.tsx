"use client";

import ButtonLikes from "@/components/Editor/buttonLikes/ButtonLikes";
import { extensions } from "@/components/Editor/TipTapEditor";
import { Button } from "@/components/ui/button";
import { BadgeUser } from "@/components/User/UserRoles";
import { CustomComment, CustomPost, CustomTopic } from "@/interfaces";
import { getUserPermissions } from "@/lib/auth/getUserPermissions";
import { useQuery } from "@tanstack/react-query";
import { generateHTML, JSONContent } from "@tiptap/react";
import { ArrowLeft, Lock, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CommentForm from "./comment-form";
import CommentList from "./comment-list";
import {
  deleteComment,
  deletePost,
  lockPost,
  SendMessage,
} from "./forum.actions";

interface PostDetailProps {
  post: CustomPost;
  topic: CustomTopic;
  onBack: () => void;
}

export default function PostDetail({ post, topic, onBack }: PostDetailProps) {
  const [renderedContent, setRenderedContent] = useState<string>("");
  const [comments, setComments] = useState<CustomComment[]>(
    post.comments || []
  );
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  useEffect(() => {
    if (post.content) {
      const html = generateHTML(post.content as JSONContent, extensions);
      setRenderedContent(html);
    }
  }, [post.content]);

  const handleCommentSubmit = async (
    content: string,
    parentId?: string,
    categoryId?: string
  ) => {
    const response = await SendMessage(
      content,
      post.id.toString(),
      parentId,
      categoryId?.toString()
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(response.success);

      const comment = response.comment as unknown as CustomComment;
      if (parentId) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id.toString() === parentId
              ? { ...c, children: [...(c.children || []), comment] }
              : c
          )
        );
      } else {
        setComments([...comments, comment]);
      }
    }
  };
  const handleDeleteComment = async (commentId: string) => {
    const response = await deleteComment(
      commentId,
      topic.categoryId.toString()
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      setComments(
        comments.filter((comment) => Number(comment.id) !== Number(commentId))
      );
      toast.success(response.success);
    }
  };

  const handleDeletePost = async () => {
    const response = await deletePost(
      post.id.toString(),
      topic.categoryId.toString()
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(response.success);
      onBack();
    }
  };

  const handleLockPost = async () => {
    const response = await lockPost(
      post.id.toString(),
      !post.isLocked,
      topic.categoryId.toString()
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      post.isLocked = !post.isLocked;
      toast.success(response.success);
      router.refresh();
    }
  };

  const { data: permission, isLoading: isLoadingPermission } = useQuery({
    queryKey: ["permission_lock_post", user?.id],
    queryFn: async () => {
      const getPermission = await getUserPermissions(
        [
          `lock_unlock_post_category_${topic.categoryId}`,
          "interact_dashboard_categories",
        ],
        user?.id
      );
      return getPermission;
    },
    enabled: !!user,
  });

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Retour
      </button>
      {user && permission && (
        <Button
          className={`${
            post.isLocked
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          } text-white`}
          onClick={handleLockPost}
        >
          {post.isLocked ? "Ouvrir le post" : "Fermer le post"}
        </Button>
      )}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row items-center mb-6 space-y-2 sm:space-y-0 sm:space-x-4">
          <Image
            className="rounded-full border-2 border-gray-300 shadow-lg"
            src={
              `/api/avatars/${post.user?.avatar}` ||
              "/uploads/images/avatars/v0_57.png"
            }
            alt={`Avatar de ${post.user.username}`}
            width={64}
            height={64}
            style={{ width: "64px", height: "64px" }}
          />
          <div className="flex flex-col items-center sm:items-start gap-2">
            <h3 className="font-bold text-xl sm:text-2xl text-gray-900 text-center sm:text-left">
              {post.user.username}
            </h3>
            <BadgeUser userId={post.user.id.toString()} />
          </div>
        </div>
        <div
          className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
        <div className="flex flex-wrap justify-between items-center gap-2">
          <span className="text-sm text-gray-500">
            Publié le {new Date(post.createdAt).toLocaleDateString("fr-FR")}
          </span>
          <ButtonLikes
            likes={post._count.likes}
            dislikes={post._count.dislikes}
            likeArray={post.likes}
            dislikeArray={post.dislikes}
            type="post"
            itemsID={post.id.toString()}
          />
        </div>
        {user && user.role === "ADMIN" && (
          <div className="flex flex-col sm:flex-row justify-start gap-2 mt-2">
            <Button
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
              onClick={handleLockPost}
            >
              <Lock className="w-4 h-4 mr-2" />
              {post.isLocked ? "Déverrouiller" : "Verrouiller"}
            </Button>
            <Button
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={handleDeletePost}
            >
              <Trash className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        )}
      </div>
      <div className="mt-6">
        {user && !topic.isLocked && !post.isLocked && (
          <CommentForm
            parentId={null}
            categoryId={topic.categoryId.toString()}
            onSubmit={handleCommentSubmit}
            setReplyingTo={() => {}}
          />
        )}
      </div>
      <div className="mt-8">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">
          Commentaires
        </h4>
        <CommentList
          comments={comments}
          onCommentSubmit={handleCommentSubmit}
          onDeleteComment={handleDeleteComment}
          topic={topic}
          post={post}
        />
      </div>
    </div>
  );
}
