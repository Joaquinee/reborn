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
import { Category, Topic } from "@prisma/client";
import { FolderIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createTopic,
  deleteTopic,
  updateTopic,
  updateTopicOrder,
} from "./action";
interface BaseItem {
  id: string | number;
  order: number | null;
  [key: string]: unknown;
}
export default function TopicsAdmin({
  category,
}: {
  category: Category & { topics: Topic[] };
}) {
  const [topics, setTopics] = useState<Topic[]>(category.topics);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    id: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "",
    content: "",
    order: 0,
    categoryId: category.id,
    isLocked: false,
    isPinned: false,
  });
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const router = useRouter();

  useEffect(() => {
    setTopics(category.topics);
  }, [category]);

  const handleCreate = async () => {
    const createdTopic = await createTopic(newTopic);
    if ("error" in createdTopic) {
      console.error(createdTopic.error);
    } else {
      setTopics([...topics, createdTopic]);
    }
    setIsCreateModalOpen(false);
  };

  const handleEdit = async (topicId: number) => {
    const topicToEdit = topics.find((topic) => topic.id === topicId);
    if (topicToEdit) {
      setEditTopic(topicToEdit);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = async () => {
    if (!editTopic) return;
    const updatedTopic = await updateTopic(editTopic);
    if ("error" in updatedTopic) {
      console.error(updatedTopic.error);
    } else {
      setTopics(
        topics.map((topic) =>
          topic.id === editTopic?.id ? updatedTopic : topic
        )
      );
    }
    setIsEditModalOpen(false);
  };

  const handleDelete = async (topicId: number) => {
    const deletedTopic = await deleteTopic(topicId);
    if ("error" in deletedTopic) {
      console.error(deletedTopic.error);
    } else {
      setTopics(topics.filter((topic) => topic.id !== topicId));
    }
  };
  const handleMoveTopic = async (updatedItems: BaseItem[]) => {
    console.log("Hello");
    console.log(updatedItems);
    const sortedTopics = updatedItems
      .map((item) => item as Topic)
      .sort((a, b) => a.order - b.order);
    toast.success("Ordre des groupes modifié");
    setTopics(sortedTopics);
    for (const topic of sortedTopics) {
      await updateTopicOrder(topic.id, topic.order);
    }
  };

  const columns = [
    {
      label: "Titre",
      key: "title",
    },
    {
      label: "Description",
      key: "content",
    },
    {
      label: "Fermer",
      key: "isLocked",
    },
    {
      label: "Position",
      key: "order",
    },
  ];
  const actions = [
    {
      label: "Modifier",
      icon: <Pencil className="h-4 w-4" />,
      onClick: (item: unknown) => handleEdit((item as Topic).id),
    },
    {
      label: "Supprimer",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: unknown) => handleDelete((item as Topic).id),
    },
  ];

  return (
    <>
      <AdminTable
        items={topics as unknown as BaseItem[]}
        columns={columns}
        actions={actions}
        title="Gestion des Topics"
        icon={<FolderIcon className="h-8 w-8 text-primary" />}
        searchPlaceholder="Rechercher un topic..."
        onCreateClick={() => setIsCreateModalOpen(true)}
        createButtonLabel="Nouveau Topic"
        createButtonIcon={<Plus className="h-4 w-4" />}
        onMoveItem={handleMoveTopic}
      />

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau topic</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={newTopic.title}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, title: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Description</Label>
              <Input
                id="content"
                value={newTopic.content}
                onChange={(e) =>
                  setNewTopic({ ...newTopic, content: e.target.value })
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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le topic</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Titre</Label>
              <Input
                id="edit-title"
                value={editTopic?.title || ""}
                onChange={(e) =>
                  setEditTopic({ ...editTopic, title: e.target.value } as Topic)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-isLocked">Fermer</Label>
              <Switch
                id="edit-isLocked"
                checked={editTopic?.isLocked || false}
                onCheckedChange={(checked: boolean) =>
                  setEditTopic({
                    ...editTopic,
                    isLocked: checked,
                  } as Topic)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Description</Label>
              <Input
                id="edit-content"
                value={editTopic?.content || ""}
                onChange={(e) =>
                  setEditTopic({
                    ...editTopic,
                    content: e.target.value,
                  } as Topic)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleUpdate}>Mettre à jour</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
