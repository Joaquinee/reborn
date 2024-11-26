import { redirect } from "next/navigation";
import { getInfoUsers } from "./action";
import UserDetailPage from "./UserPage";

export default async function UserPages({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (!slug) {
    return redirect("/admin/users");
  }
  const user = await getInfoUsers(slug);
  return <UserDetailPage user={user} />;
}
