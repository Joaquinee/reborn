"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Shield } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminTable } from "@/components/Admin/TableAdmin";
import { Button } from "@/components/ui/button";

import { getAllPermissions, getRoles, togglePermission } from "./actions";

interface Permission {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  permission: Permission;
  active: boolean;
}

interface Role {
  id: number;
  name: string;
  active: boolean;
}

export default function RolePermissionsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  if (!slug) {
    router.push("/admin/groups");
  }
  if (Number(slug) === 1) {
    toast.error("Vous ne pouvez pas modifier les permissions du groupe admin");
    router.push("/admin/groups");
  }

  const { data: allPermissions = [] } = useQuery<Permission[]>({
    queryKey: ["allPermissions", slug],
    queryFn: () => getAllPermissions(Number(slug)),
  });

  const { data: role = null } = useQuery<Role>({
    queryKey: ["role", slug],
    queryFn: async () => {
      const roles = await getRoles(Number(slug));
      return roles.length > 0 ? roles[0] : null;
    },
  });

  const togglePermissionMutation = useMutation({
    mutationFn: ({
      roleId,
      permissionId,
      active,
    }: {
      roleId: number;
      permissionId: number;
      active: boolean;
    }) => togglePermission(roleId, permissionId, active),
    onMutate: async ({ roleId, permissionId, active }) => {
      await queryClient.cancelQueries({ queryKey: ["allPermissions", slug] });

      const previousPermissions = queryClient.getQueryData<Permission[]>([
        "allPermissions",
        slug,
      ]);

      queryClient.setQueryData<Permission[]>(["allPermissions", slug], (old) =>
        old?.map((permission) =>
          permission.id === permissionId
            ? { ...permission, active }
            : permission
        )
      );

      return { previousPermissions };
    },
    onError: (err, variables, context) => {
      if (context?.previousPermissions) {
        queryClient.setQueryData<Permission[]>(
          ["allPermissions", slug],
          context.previousPermissions
        );
      }
      toast.error("Erreur lors de la mise à jour de l'état de la permission");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allPermissions", slug] });
    },
    onSuccess: () => {
      toast.success("État de la permission mis à jour");
    },
  });

  const handleToggleActive = async (id: string | number, value: boolean) => {
    togglePermissionMutation.mutate({
      roleId: Number(slug),
      permissionId: Number(id),
      active: value,
    });
  };

  const columns = [
    { key: "name", label: "Nom de la permission" },
    { key: "active", label: "Actif" },
  ];

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        <AdminTable
          items={allPermissions.map((permission) => ({
            id: permission.id,
            name: permission.description,
            active: permission.active,
            order: permission.id,
          }))}
          columns={columns}
          actions={[]}
          title={`Gestion des permissions pour ${role?.name || ""}`}
          icon={<Shield className="h-8 w-8 text-primary" />}
          searchPlaceholder="Rechercher une permission..."
          onCreateClick={() => {}}
          createButtonLabel=""
          createButtonIcon={<></>}
          onMoveItem={() => {}}
          onToggleActive={handleToggleActive}
        />
      </div>
    </>
  );
}
