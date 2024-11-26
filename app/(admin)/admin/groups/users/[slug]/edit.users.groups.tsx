"use client";
import { Users as TypeUsers } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Trash2, UserCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminTable } from "@/components/Admin/TableAdmin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addUserToRole, deleteRolesAtUsers, getAllUsers } from "./actions";

interface BaseItem {
  id: string | number;
  username: string | number;
  email: string | number;
  order: number | null;
  [key: string]: unknown;
}

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

export default function EditUsersGroups({
  users,
  roleId,
}: {
  users: UsersRoles[];
  roleId: number;
}) {
  const [usersState, setUsersState] = useState<UsersRoles[]>([]);
  const [roleIdState, setRoleIdState] = useState<number>(roleId);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<TypeUsers | null>(null);

  const { data: allUsers = [] } = useQuery<TypeUsers[]>({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
    staleTime: 1000 * 60 * 1,
  });

  useEffect(() => {
    const allUsersList = users.map((userRole) => ({
      id: userRole.userId,
      username: userRole.user.username,
      email: userRole.user.email,
      roleId: userRole.roleId,
    }));
    setUsersState(allUsersList as unknown as UsersRoles[]);
  }, [users]);

  const handleDelete = async (userId: string, roleId: string) => {
    const response = await deleteRolesAtUsers(
      Number(userId),
      Number(roleIdState)
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Utilisateur supprimé");
      setUsersState((prev) =>
        prev.filter((user) => user?.id && user.id.toString() !== userId)
      );
    }
  };

  const handleAddUser = async () => {
    if (selectedUser) {
      if (!roleIdState) {
        toast.error("Veuillez sélectionner un groupe");
        return;
      }
      const response = await addUserToRole(selectedUser.id, roleIdState);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Utilisateur ajouté");
        setIsOpen(false);
        setSearchTerm("");
        setSelectedUser(null);
        router.refresh();
      }
    }
  };

  const columns = [
    { key: "username", label: "Nom" },
    { key: "email", label: "Email" },
  ];

  const actions = [
    {
      label: "Supprimer",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: unknown) => {
        const userRole = item as UsersRoles;
        handleDelete(userRole.id.toString(), userRole.roleId.toString());
      },
    },
  ];

  const filteredUsers = allUsers.filter(
    (user) =>
      !usersState.some((existingUser) => existingUser.id === user.id) &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <AdminTable
        items={usersState as unknown as BaseItem[]}
        columns={columns}
        actions={actions}
        title="Gestion des utilisateurs pour le groupe"
        icon={<Users className="h-8 w-8 text-primary" />}
        searchPlaceholder="Rechercher un utilisateur..."
        onCreateClick={() => setIsOpen(true)}
        createButtonLabel="Ajouter"
        createButtonIcon={<UserCog className="h-4 w-4" />}
        onMoveItem={() => {}}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Sélectionnez un utilisateur à ajouter au groupe
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              onValueChange={(value) => {
                const user = filteredUsers.find(
                  (u) => u.id.toString() === value
                );
                setSelectedUser(user || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un utilisateur" />
              </SelectTrigger>
              <SelectContent>
                {filteredUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.username} - {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddUser} disabled={!selectedUser}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
