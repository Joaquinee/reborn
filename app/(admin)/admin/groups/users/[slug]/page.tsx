import { getUsers } from "./actions";
import EditUsersGroups from "./edit.users.groups";

interface UsersRoles {
  id: number;
  userId: number;
  roleId: number;
  user: {
    id: number;
    username: string;
    roleId: number;
    email: string;
  };
}

export default async function UsersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const users = await getUsers(slug);

  return (
    <EditUsersGroups
      users={users as unknown as UsersRoles[]}
      roleId={Number(slug)}
    />
  );
}
