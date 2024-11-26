"use client";

import { CustomPost, CustomTopic } from "@/interfaces";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreatePost from "./create-post";
import { createPost } from "./forum.actions";
import PostDetail from "./post-detail";
import PostList from "./post-list";
import TopicActions from "./topic-actions";

interface TopicPostsProps {
  topic: CustomTopic;
  handlePostClick: (post: CustomPost) => void;
  viewPost: CustomPost | null;
  setSelectedPost: (post: CustomPost | null) => void;
  selectedPost: CustomPost | null;
}

export default function TopicPosts({
  topic,
  handlePostClick,
  setSelectedPost,
  selectedPost,
  viewPost,
}: TopicPostsProps) {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (viewPost) {
      setSelectedPost(viewPost);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [viewPost, setSelectedPost, topic]);

  const handleCreatePost = async (title: string, content: string) => {
    const response = await createPost(
      title,
      content,
      topic.id.toString(),
      topic.categoryId.toString()
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(response.success);
    }

    setShowCreatePost(false);
    setSelectedPost(null);
    router.push(`/forums?topic=${topic.id}&post=${response.post?.id}`);
    router.refresh();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">
            {topic.title}
            {topic.isLocked && (
              <span className="text-sm ml-5 bg-gray-600 px-3 py-1 rounded-full">
                Ce topic est verrouillé
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-300 mt-2">{topic.content}</p>
        </div>

        <TopicActions topic={topic} setShowCreatePost={setShowCreatePost} />
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {showCreatePost ? (
          <CreatePost
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreatePost(false)}
          />
        ) : selectedPost ? (
          <PostDetail
            post={selectedPost}
            topic={topic}
            onBack={() => setSelectedPost(null)}
          />
        ) : (
          <PostList posts={topic.posts} handlePostClick={handlePostClick} />
        )}
      </div>
    </div>
  );
}
