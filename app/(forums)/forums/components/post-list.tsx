import ButtonLikes from "@/components/Editor/buttonLikes/ButtonLikes";
import { BadgeUser } from "@/components/User/UserRoles";
import { CustomPost } from "@/interfaces";
import Image from "next/image";

interface PostListProps {
  posts: CustomPost[];
  handlePostClick: (post: CustomPost) => void;
}

export default function PostList({ posts, handlePostClick }: PostListProps) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-6 first:pt-0 border-b border-gray-200 pb-6 last:border-b-0"
        >
          <div className="flex-shrink-0 flex justify-center">
            <Image
              className="rounded-full border-2 border-gray-200"
              src={
                `/api/avatars/${post.user?.avatar}` ||
                "/uploads/images/avatars/v0_57.png"
              }
              alt={`Avatar de ${post.user.username}`}
              width={64}
              height={64}
              style={{ width: "64px", height: "64px" }}
            />
          </div>
          <div
            onClick={() => handlePostClick(post)}
            className="flex-grow cursor-pointer transition-colors"
          >
            <div className="flex flex-col">
              <h5 className="font-semibold text-gray-900 truncate max-w-[200px] mb-1">
                {post.title}
              </h5>
            </div>
            <p className="text-gray-600 mb-2">{post.user.username}</p>
            <div className="flex items-center gap-2 mb-2 mt-3">
              <BadgeUser userId={post.user.id.toString()} />
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString("fr-FR")}
              </span>
              <ButtonLikes
                likes={post._count.likes}
                dislikes={post._count.dislikes}
                likeArray={post.likes}
                dislikeArray={post.dislikes}
                itemsID={post.id.toString()}
                type="post"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
