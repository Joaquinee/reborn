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

import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCategory } from "./actions";
import { Category } from "./categorie.admin";

interface EditCategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, updatedCategory: Category) => void;
}

export function EditCategoryModal({
  category,
  isOpen,
  onClose,
  onUpdate,
}: EditCategoryModalProps) {
  const [editedCategory, setEditedCategory] = useState<Category | null>(
    category
  );

  useEffect(() => {
    setEditedCategory(category);
  }, [category]);

  const handleUpdate = async () => {
    if (!editedCategory) return;

    try {
      const result = await updateCategory(editedCategory);
      if ("error" in result) {
        console.error("Erreur lors de la mise à jour:", result.error);
      } else {
        onUpdate(editedCategory.id, result);
        onClose();
        toast.success("Catégorie modifiée");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  if (!editedCategory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Nom</Label>
            <Input
              id="edit-name"
              value={editedCategory.name}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, name: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-public">Public</Label>
            <Switch
              id="edit-public"
              checked={editedCategory.public}
              onCheckedChange={(checked) =>
                setEditedCategory({ ...editedCategory, public: checked })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-slug">Slug</Label>
            <Input
              id="edit-slug"
              value={editedCategory.slug}
              onChange={(e) =>
                setEditedCategory({ ...editedCategory, slug: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input
              id="edit-description"
              value={editedCategory.description}
              onChange={(e) =>
                setEditedCategory({
                  ...editedCategory,
                  description: e.target.value,
                })
              }
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
