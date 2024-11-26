"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JSONContent } from "@tiptap/react";
import { Send, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const TipTapEditor = dynamic(() => import("@/components/Editor/TipTapEditor"), {
  ssr: false,
  loading: () => <div>Chargement de l&apos;éditeur...</div>,
});

interface CreatePostProps {
  onSubmit: (title: string, content: string) => void;
  onCancel: () => void;
}

export default function CreatePost({ onSubmit, onCancel }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [jsonContent, setJsonContent] = useState<JSONContent | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, jsonContent ? JSON.stringify(jsonContent) : content);
    setTitle("");
    setContent("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Créer un nouveau post</CardTitle>
          <CardDescription>
            Partagez vos pensées avec la communauté
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              placeholder="Entrez le titre de votre post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Contenu</Label>
            <TipTapEditor
              content={content}
              onChange={setContent}
              setJsonContent={setJsonContent}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit">
            <Send className="w-4 h-4 mr-2" />
            Publier
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
