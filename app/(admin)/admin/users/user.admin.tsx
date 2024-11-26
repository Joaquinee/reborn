"use client";
import { AdminTable } from "@/components/Admin/TableAdmin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users as PrismaUsers } from "@prisma/client";
import { Pencil, Trash2, UserCog, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createUser, deleteUser } from "./actions";

interface BaseItem {
  id: string | number;
  order: number | null;
  [key: string]: unknown;
}

export default function UserAdmin({ users }: { users: PrismaUsers[] }) {
  const [usersState, setUsersState] = useState<PrismaUsers[]>(
    users.map((user) => ({
      ...user,
      order: 0,
    }))
  );
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    setUsersState(
      users.map((user) => ({
        ...user,
        order: 0,
      }))
    );
  }, [users]);

  const handleEdit = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  const handleDelete = async (userId: string) => {
    const response = await deleteUser(userId);
    if (response.error) {
      console.error(response.error);
    } else {
      setUsersState((prev) =>
        prev.filter((user) => user.id.toString() === userId)
      );
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createUser(newUser as PrismaUsers);
    if (response.error) {
      console.error(response.error);
    } else {
      router.push("/admin/users");
    }
    setIsOpen(false);
    setNewUser({ username: "", email: "", password: "" });
  };

  const columns = [
    { key: "username", label: "Nom" },
    { key: "email", label: "Email" },
  ];
  const actions = [
    {
      label: "Modifier",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: unknown) =>
        handleEdit((item as PrismaUsers).id.toString()),
    },
    {
      label: "Supprimer",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: unknown) =>
        handleDelete((item as PrismaUsers).id.toString()),
    },
  ];

  return (
    <>
      <AdminTable
        items={usersState as unknown as BaseItem[]}
        columns={columns}
        actions={actions}
        title="Gestion des utilisateurs"
        icon={<Users className="h-8 w-8 text-primary" />}
        searchPlaceholder="Rechercher un utilisateur..."
        onCreateClick={() => setIsOpen(true)}
        createButtonLabel="Crée un utilisateur"
        createButtonIcon={<UserCog className="h-4 w-4" />}
        onMoveItem={() => {}}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
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
    </>
  );
}
