"use client";

import { CustomLike } from "@/interfaces";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { dislikesItems, likesItems } from "./buttonLikes.actions";

export default function ButtonLikes({
  likes,
  dislikes,
  likeArray,
  dislikeArray,
  type,
  itemsID,
}: {
  likes: number;
  dislikes: number;
  likeArray: CustomLike[];
  dislikeArray: CustomLike[];
  type: "post" | "comments";
  itemsID: string;
}) {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [likeArr, setLikeArr] = useState(likeArray);
  const [dislikeArr, setDislikeArr] = useState(dislikeArray);

  const session = useSession();

  const handleLikePost = async () => {
    if (session.data?.user) {
      const userId = session.data.user.id;
      if (likeArr.some((like) => like.userId.toString() === userId)) {
        if (likeCount > 0) {
          setLikeCount(likeCount - 1);
          setLikeArr(likeArr.filter((like) => like.userId !== userId));
        }
      } else {
        setLikeCount(likeCount + 1);
        setLikeArr([...likeArr, { userId }]);
      }
      await likesItems(type, itemsID);
    }
  };

  const handleDislikePost = async () => {
    if (session.data?.user) {
      const userId = session.data.user.id;
      if (
        dislikeArr.some((dislikes) => dislikes.userId.toString() === userId)
      ) {
        if (dislikeCount > 0) {
          setDislikeCount(dislikeCount - 1);
          setDislikeArr(dislikeArr.filter((like) => like.userId !== userId));
        }
      } else {
        setDislikeCount(dislikeCount + 1);
        setDislikeArr([...dislikeArr, { userId }]);
      }
      await dislikesItems(type, itemsID);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleLikePost}
          className="flex items-center bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-1.5 rounded-full hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ThumbsUp className="w-4 h-4 mr-1.5" />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button
          onClick={handleDislikePost}
          className="flex items-center bg-gradient-to-r from-gray-500 to-gray-400 text-white px-3 py-1.5 rounded-full hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ThumbsDown className="w-4 h-4 mr-1.5" />
          <span className="text-sm font-medium">{dislikeCount}</span>
        </button>
      </div>
    </>
  );
}
