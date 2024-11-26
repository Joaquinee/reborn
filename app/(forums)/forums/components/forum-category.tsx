import { CustomForum, CustomTopic } from "@/interfaces";
import { ChevronDown, MessageCircle } from "lucide-react";

interface ForumCategoryProps {
  forum: CustomForum;
  isOpen: boolean;
  toggleCategory: (slug: string) => void;
  handleTopicClick: (topic: CustomTopic) => void;
}

export default function ForumCategory({
  forum,
  isOpen,
  toggleCategory,
  handleTopicClick,
}: ForumCategoryProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={() => toggleCategory(forum.slug)}
        className="w-full bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4 flex justify-between items-center hover:from-gray-700 hover:to-gray-600 transition-colors"
        style={{ textAlign: "left" }}
      >
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">{forum.name}</h2>
          <p className="text-sm text-gray-300 mt-2">{forum.description}</p>
        </div>
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-300 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 divide-y divide-gray-200">
          {forum.topics
            .sort((a, b) => a.order - b.order)
            .map((topic) => (
              <div
                key={topic.id}
                className="flex gap-4 pt-4 first:pt-0 items-start"
              >
                <MessageCircle className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    <button
                      onClick={() => handleTopicClick(topic)}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {topic.title}
                    </button>
                  </h3>
                  <p className="text-gray-600">{topic.content}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
