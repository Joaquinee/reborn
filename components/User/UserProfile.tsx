"use client";

import { deleteUser } from "@/app/(admin)/admin/users/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UpdateUser } from "@/interfaces";
import { Ban, Save, Trash2, Upload, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { banOrUnbanUser, updatePassword, updateUser } from "./action";
import RoleAdmin from "./roles.admin";
interface UserProfileProps {
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    isBanned: boolean;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isBanned, setIsBanned] = useState(user.isBanned);
  const [role, setRole] = useState(user.role);
  const [username, setUsername] = useState(user.username);

  const router = useRouter();
  const handleUpdatePassword = async (password: string) => {
    const response = await updatePassword(Number(user.id), password);
    if (response.error) {
      console.error(response.error);
    } else {
      toast.success(response.success);
    }
  };

  const handleSave = async () => {
    if (password) {
      await handleUpdatePassword(password);
    }
    const userData: UpdateUser = {
      id: Number(user.id),
      email,
      username,
      password,
      avatar: user.avatar || null,
    };

    const response = await updateUser(Number(user.id), userData);
    if (response.error) {
      console.error(response.error);
    } else {
      toast.success(response.success);
    }
  };

  const handleDelete = async () => {
    const response = await deleteUser(user.id);
    if (response.error) {
      console.error(response.error);
    } else {
      toast.success(response.success);
      router.push("/admin/users");
    }
  };

  const handleBanToggle = async () => {
    setIsBanned(!isBanned);
    const response = await banOrUnbanUser(Number(user.id), !isBanned);
    if (response.error) {
      console.error(response.error);
    } else {
      toast.success(response.success);
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          Informations de l&apos;utilisateur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={
                `/api/avatars/${user.avatar}` ||
                "/uploads/images/avatars/v0_57.png"
              }
            />
            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Changer l&apos;avatar
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Pseudo</Label>
            <Input
              id="username"
              value={user.username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <RoleAdmin userId={user.id} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Laisser vide pour ne pas modifier"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </Button>
            <Button
              variant="outline"
              onClick={handleBanToggle}
              className={isBanned ? "text-green-600" : "text-red-600"}
            >
              <Ban className="h-4 w-4 mr-2" />
              {isBanned ? "Débannir" : "Bannir"}
            </Button>
          </div>

          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center justify-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer le compte
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
