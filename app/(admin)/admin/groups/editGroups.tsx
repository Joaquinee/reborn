"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ColorPicker } from "@/components/Editor/ColorPicker";
import { Switch } from "@/components/ui/switch";
import { Roles } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateRole } from "./actions";

interface EditRolesModalProps {
  role: Roles | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, updatedCategory: Roles) => void;
}

export function EditRolesModal({
  role,
  isOpen,
  onClose,
  onUpdate,
}: EditRolesModalProps) {
  const [editedRole, setEditedRole] = useState<Roles | null>(role);

  useEffect(() => {
    setEditedRole(role);
  }, [role]);

  const handleUpdate = async () => {
    if (!editedRole) return;

    try {
      const result = await updateRole(editedRole.id, editedRole);
      if ("error" in result) {
        console.error("Erreur lors de la mise à jour:", result.error);
      } else {
        const updatedRole: Roles = {
          ...editedRole,
          ...result,
        };
        onUpdate(editedRole.id, updatedRole);
        toast.success("Groupe modifié");
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (!editedRole) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le groupe</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nom</Label>
            <Input
              id="edit-name"
              value={editedRole.name}
              onChange={(e) =>
                setEditedRole({ ...editedRole, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-staff">Staff</Label>
            <Switch
              id="edit-staff"
              checked={editedRole.staff || false}
              onCheckedChange={(checked) =>
                setEditedRole({ ...editedRole, staff: checked })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-color">Couleur</Label>
            <ColorPicker
              color={editedRole.color || "#FFFFFF"}
              onChange={(color) =>
                setEditedRole({ ...editedRole, color: color.toString() })
              }
              onClear={() => setEditedRole({ ...editedRole, color: "" })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleUpdate}>Mettre à jour</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
