import { Badge } from "@/components/ui/badge";
import { Roles } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { getUserRolesById } from "./action";

interface UserRoles {
  roleId: number;
  role: Roles;
}
export function BadgeUser({ userId }: { userId: string }) {
  const { data: userRoles, isLoading: isUserRolesLoading } = useQuery({
    queryKey: ["userRoles", userId],
    queryFn: async () => {
      const response = await getUserRolesById(Number(userId));
      return response;
    },
    staleTime: 1000 * 60 * 1,
  });

  return (
    <div className="flex flex-wrap gap-2">
      {userRoles?.map((role: UserRoles) => (
        <Badge
          key={role.roleId}
          className="px-3 py-1 rounded-full shadow-md font-semibold text-white"
          style={{ backgroundColor: role.role.color }}
        >
          {role.role.name}
        </Badge>
      ))}
    </div>
  );
}
