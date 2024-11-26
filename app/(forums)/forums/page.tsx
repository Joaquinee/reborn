import { CustomForum } from "@/interfaces";
import ForumContentNew from "./components/forum-content";
import { getAllForums } from "./forums.actions";

export default async function ForumsPage() {
  const forums = await getAllForums();
  return (
    <>
      <ForumContentNew forums={forums as unknown as CustomForum[]} />
    </>
  );
}
