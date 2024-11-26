"use client";

import { AdminTable } from "@/components/Admin/TableAdmin";
import { ColorPicker } from "@/components/Editor/ColorPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Roles } from "@prisma/client";
import { Pencil, Shield, Trash2, UserCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createRole, deleteRole, updateRoleOrder } from "./actions";
import { EditRolesModal } from "./editGroups";

interface BaseItem {
  id: string | number;
  [key: string]: unknown;
}

export default function UserGroups({ allGroups }: { allGroups: Roles[] }) {
  const [rolesStates, setRolesState] = useState<Roles[]>(allGroups);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    color: "",
  });
  const [roleToEdit, setRoleToEdit] = useState<Roles | null>(null);

  useEffect(() => {
    setRolesState(allGroups);
  }, [allGroups]);

  const handleEdit = (roleId: number) => {
    setRoleToEdit(rolesStates.find((role) => role.id === roleId) || null);
  };

  const handleDelete = async (roleId: string) => {
    const response = await deleteRole(roleId);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Groupe supprimé");
      setRolesState((prev) =>
        prev.filter((role) => role.id.toString() !== roleId)
      );
    }
  };
  const handleMoveRole = async (updatedItems: BaseItem[]) => {
    const sortedRoles = updatedItems
      .map((item) => item as Roles)
      .sort((a, b) => a.order - b.order);
    toast.success("Ordre des groupes modifié");
    setRolesState(sortedRoles);
    for (const role of sortedRoles) {
      await updateRoleOrder(role.id, role.order);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createRole(newRole as unknown as Roles);
    if (response.error) {
      toast.error(response.error);
      console.error(response.error);
    } else {
      toast.success("Groupe créé");
      router.push("/admin/groups");
    }
    setIsOpen(false);
    setNewRole({ name: "", color: "" });
  };

  const columns = [
    { key: "name", label: "Nom" },
    { key: "color", label: "Couleur" },
    { key: "staff", label: "Staff" },
    { key: "order", label: "Position" },
  ];
  const actions = [
    {
      label: "Modifier",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: unknown) => handleEdit((item as Roles).id),
    },
    {
      label: "Supprimer",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: unknown) => handleDelete((item as Roles).id.toString()),
    },
    {
      label: "Voir les utilisateurs",
      icon: <Users className="h-4 w-4" />,
      onClick: (item: unknown) =>
        router.push(`/admin/groups/users/${(item as Roles).id}`),
    },
    {
      label: "Editer les permissions",
      icon: <Shield className="h-4 w-4" />,
      onClick: (item: unknown) =>
        router.push(`/admin/groups/permissions/${(item as Roles).id}`),
    },
  ];
  return (
    <>
      <AdminTable
        items={rolesStates}
        columns={columns}
        actions={actions}
        title="Gestion des groupes"
        icon={<Users className="h-8 w-8 text-primary" />}
        searchPlaceholder="Rechercher un groupe..."
        onCreateClick={() => setIsOpen(true)}
        createButtonLabel="Crée un groupe"
        createButtonIcon={<UserCog className="h-4 w-4" />}
        onMoveItem={handleMoveRole}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateRole} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du groupe</Label>
              <Input
                id="name"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Couleur</Label>
              <ColorPicker
                color={newRole.color || "#FFFFF"}
                onChange={(color) =>
                  setNewRole({ ...newRole, color: color.toString() })
                }
                onClear={() => setNewRole({ ...newRole, color: "" })}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Créer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <EditRolesModal
        role={roleToEdit}
        isOpen={!!roleToEdit}
        onClose={() => setRoleToEdit(null)}
        onUpdate={(id: number, updatedRole: Roles) => {
          setRolesState(
            rolesStates.map((role) =>
              role.id === updatedRole.id ? updatedRole : role
            )
          );
        }}
      />
    </>
  );
}
