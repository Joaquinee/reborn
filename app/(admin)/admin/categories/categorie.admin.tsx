"use client";

import { AdminTable } from "@/components/Admin/TableAdmin";
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
import { Code, FolderIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createCategory, deleteCategory, updateCategoryOrder } from "./actions";
import { EditCategoryModal } from "./editCategorie";

export interface Category {
  id: number;
  name: string;
  order: number;
  slug: string;
  description: string;
  public: boolean;
}

interface BaseItem {
  id: string | number;
  order: number | null;
  [key: string]: unknown;
}

export default function CategorieAdminPages({ items }: { items: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(items);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({
    id: 0,
    name: "",
    order: 0,
    slug: "",
    description: "",
    public: false,
  });
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    setCategories(items);
  }, [items]);

  const handleTopicsNavigation = (id: number) => {
    router.push(`/admin/categories/${id}/topics`);
  };

  const handleCreate = async () => {
    try {
      const result = await createCategory(newCategory);
      if ("error" in result) {
        console.error("Erreur lors de la création:", result.error);
      } else {
        setNewCategory({
          id: 0,
          name: "",
          order: 0,
          slug: "",
          description: "",
          public: false,
        });
        setCategories([...categories, result]);
        setIsCreateModalOpen(false);
        toast.success("Catégorie créée");
      }
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    }
  };

  const handleEdit = (categoryId: number) => {
    setCategoryToEdit(categories.find((cat) => cat.id === categoryId) || null);
  };

  const handleDelete = async (categoryId: number) => {
    const result = await deleteCategory(categoryId);
    if ("error" in result) {
      console.error("Erreur lors de la suppression:", result.error);
    } else {
      toast.success("Catégorie supprimée");
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    }
  };

  const handleMoveCategory = async (updatedItems: Category[]) => {
    const sortedCategories = updatedItems.sort((a, b) => a.order - b.order);
    setCategories(sortedCategories);
    toast.success("Ordre des catégories modifié");
    for (const category of sortedCategories) {
      await updateCategoryOrder(category.id, category.order);
    }
  };

  const columns = [
    { key: "name", label: "Nom" },
    { key: "slug", label: "Slug" },
    { key: "description", label: "Description" },
    { key: "public", label: "Public" },
    { key: "order", label: "Position" },
  ];

  const actions = [
    {
      label: "Modifier",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: unknown) => handleEdit((item as Category).id),
    },
    {
      label: "Topics",
      icon: <Code className="h-4 w-4" />,
      onClick: (item: unknown) => handleTopicsNavigation((item as Category).id),
    },
    {
      label: "Supprimer",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: unknown) => handleDelete((item as Category).id),
    },
  ];

  return (
    <>
      <AdminTable
        items={categories as unknown as BaseItem[]}
        columns={columns}
        actions={actions}
        title="Gestion des Catégories"
        icon={<FolderIcon className="h-8 w-8 text-primary" />}
        searchPlaceholder="Rechercher une catégorie..."
        onCreateClick={() => setIsCreateModalOpen(true)}
        createButtonLabel="Nouvelle Catégorie"
        createButtonIcon={<Plus className="h-4 w-4" />}
        onMoveItem={
          handleMoveCategory as unknown as (updatedItems: BaseItem[]) => void
        }
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={newCategory.slug}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, slug: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="public">Public</Label>
              <Switch
                id="public"
                checked={newCategory.public}
                onCheckedChange={(checked) =>
                  setNewCategory({ ...newCategory, public: checked })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleCreate}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditCategoryModal
        category={categoryToEdit}
        isOpen={!!categoryToEdit}
        onClose={() => setCategoryToEdit(null)}
        onUpdate={(id: number, updatedCategory: Category) => {
          setCategories(
            categories.map((cat) =>
              cat.id === updatedCategory.id ? updatedCategory : cat
            )
          );
        }}
      />
    </>
  );
}
