import { Badge } from "@/components/ui/badge";
import { Roles } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, XCircle } from "lucide-react";
import {
  addRoleToUser,
  getAllRoles,
  getUserRolesById,
  removeRoleFromUser,
} from "./action";

interface UserRoles {
  roleId: number;
  role: Roles;
}

export function RoleAdmin({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { data: userRoles, isLoading: isUserRolesLoading } = useQuery({
    queryKey: ["userRoles", userId],
    queryFn: async () => {
      const response = await getUserRolesById(Number(userId));
      return response;
    },
    staleTime: 1000 * 60 * 1,
  });

  const { data: allRoles, isLoading: isAllRolesLoading } = useQuery({
    queryKey: ["allRoles"],
    queryFn: async () => {
      const response = await getAllRoles();
      return response;
    },
    staleTime: 1000 * 60 * 1,
  });

  const addRoleMutation = useMutation({
    mutationFn: async (roleId: number) => {
      const response = await addRoleToUser(Number(userId), roleId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
    },
  });

  const removeRoleMutation = useMutation({
    mutationFn: async (roleId: number) => {
      const response = await removeRoleFromUser(Number(userId), roleId);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userRoles", userId] });
    },
  });

  const userRoleIds = userRoles?.map((ur) => ur.roleId) || [];

  if (isUserRolesLoading || isAllRolesLoading) {
    return <div className="flex gap-2">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Rôles actuels</h3>
        <div className="flex flex-wrap gap-2">
          {userRoles?.map((userRole) => (
            <Badge
              key={userRole.roleId}
              className="px-3 py-1 rounded-full shadow-md font-semibold text-white flex items-center gap-1"
              style={{ backgroundColor: userRole.role.color }}
            >
              {userRole.role.name}
              <XCircle
                className="h-4 w-4 cursor-pointer hover:text-red-200 transition-colors"
                onClick={() => removeRoleMutation.mutate(userRole.roleId)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Ajouter un rôle</h3>
        <div className="flex flex-wrap gap-2">
          {allRoles
            ?.filter((role: Roles) => !userRoleIds.includes(role.id))
            .map((role: Roles) => (
              <Badge
                key={role.id}
                className="px-3 py-1 rounded-full shadow-md font-semibold text-white flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: role.color }}
                onClick={() => addRoleMutation.mutate(role.id)}
              >
                {role.name}
                <PlusCircle className="h-4 w-4" />
              </Badge>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RoleAdmin;
