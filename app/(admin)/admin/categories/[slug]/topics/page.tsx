import { Category, Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { getCategoryBySlug } from "./action";
import TopicsAdmin from "./topics.admin";

export default async function TopicsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (!slug) {
    return redirect("/admin/categories");
  }
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return redirect("/admin/categories");
  }
  return (
    <TopicsAdmin
      category={category as unknown as Category & { topics: Topic[] }}
    />
  );
}
