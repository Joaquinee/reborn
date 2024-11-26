import { getAllRoles } from "./actions";
import UserGroups from "./user.groups";

export default async function AdminRoles() {
  const allGroups = await getAllRoles();
  return <UserGroups allGroups={allGroups} />;
}
