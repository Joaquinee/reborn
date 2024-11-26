"use client";

import NavBar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { CustomForum, CustomPost, CustomTopic } from "@/interfaces";
import CardOnline from "@/task/online/CardOnline";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getAllForums } from "../forums.actions";
import ForumCategory from "./forum-category";
import ForumContentLoader from "./forum-content-loader";
import SocialLinks from "./social-links";
import TopicPosts from "./topic-posts";

export default function ForumContent({
  forums: initialForums,
}: {
  forums: CustomForum[];
}) {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    initialForums.reduce((acc, forum) => ({ ...acc, [forum.slug]: true }), {})
  );
  const [selectedTopic, setSelectedTopic] = useState<CustomTopic | null>(null);
  const [selectedPost, setSelectedPost] = useState<CustomPost | null>(null);
  const router = useRouter();
  const handleBackToForums = () => router.push("/forums");
  const searchParams = useSearchParams();
  const topicParam = searchParams.get("topic");
  const postParam = searchParams.get("post");

  const updateSelection = useCallback(
    (topic: CustomTopic | undefined, post: CustomPost | undefined) => {
      if (topicParam && postParam) {
        setSelectedTopic(topic || null);
        setSelectedPost(post || null);
      } else if (topicParam) {
        setSelectedTopic(topic || null);
        setSelectedPost(null);
      } else if (postParam) {
        setSelectedPost(post || null);
        setSelectedTopic(
          topic ||
            initialForums
              .flatMap((forum) => forum.topics || [])
              .find((t) =>
                t.posts.some((p) => p.id.toString() === postParam)
              ) ||
            null
        );
      } else {
        setSelectedTopic(null);
        setSelectedPost(null);
      }
    },
    [topicParam, postParam, initialForums]
  );

  const findTopicAndPost = useCallback(() => {
    const allTopics = initialForums.flatMap((forum) => forum.topics || []);
    const allPosts = allTopics.flatMap((topic) => topic.posts || []);
    const topic = allTopics.find((topic) => topic.id.toString() === topicParam);
    const post = allPosts.find((post) => post.id.toString() === postParam);
    return { topic, post };
  }, [initialForums, topicParam, postParam]);

  useEffect(() => {
    const { topic, post } = findTopicAndPost();
    updateSelection(topic, post);
  }, [findTopicAndPost, updateSelection]);

  const toggleCategory = (categorySlug: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categorySlug]: !prev[categorySlug],
    }));
  };

  const handleTopicClick = (topic: CustomTopic) => {
    setSelectedPost(null);
    setSelectedTopic(topic);
    router.push(`?topic=${topic.id}`);
  };

  const handlePostClick = (post: CustomPost) => {
    if (!selectedTopic) return;
    setSelectedPost(post);
    router.push(`?topic=${selectedTopic.id}&post=${post.id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const { data: forums, isLoading: isForumsLoading } = useQuery({
    queryKey: ["forums"],
    queryFn: async () => {
      const response = await getAllForums();
      return response;
    },
    initialData: initialForums,
    staleTime: 1000 * 60 * 1,
  });

  const { data: selectedTopicData, isLoading: isTopicLoading } = useQuery({
    queryKey: ["topic", topicParam],
    queryFn: async () => {
      if (!topicParam) return null;
      const response = initialForums
        .flatMap((forum) => forum.topics || [])
        .find((topic: CustomTopic) => topic.id.toString() === topicParam);
      return response;
    },
    enabled: !!topicParam,
  });

  const displayedTopic = selectedTopicData || selectedTopic;

  if (isForumsLoading || isTopicLoading) {
    return (
      <>
        <NavBar />
        <ForumContentLoader />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">
            San Andreas Reborn
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <Button
                variant="ghost"
                onClick={handleBackToForums}
                className="flex items-center bg-gray-800 text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux forums
              </Button>
              {displayedTopic ? (
                <TopicPosts
                  topic={displayedTopic}
                  handlePostClick={handlePostClick}
                  viewPost={selectedPost}
                  setSelectedPost={setSelectedPost}
                  selectedPost={selectedPost}
                />
              ) : (
                forums?.map((forum: CustomForum) => (
                  <ForumCategory
                    key={forum.id}
                    forum={forum}
                    isOpen={openCategories[forum.slug]}
                    toggleCategory={toggleCategory}
                    handleTopicClick={handleTopicClick}
                  />
                ))
              )}
            </div>
            <div className="space-y-8">
              <CardOnline />
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
