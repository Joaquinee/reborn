import { Users } from "@prisma/client";
import { redirect } from "next/navigation";
import { getUsers } from "./actions";
import UserAdmin from "./user.admin";

export default async function AdminUsers() {
  const users = await getUsers();
  if ("error" in users) {
    return redirect("/");
  }

  return <UserAdmin users={users as unknown as Users[]} />;
}
