import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

interface CommentFormProps {
  onSubmit: (comment: string, parentId?: string, categoryId?: string) => void;
  parentId?: string | null;
  categoryId?: string | null;
  setReplyingTo: (id: string | null) => void;
}

export default function CommentForm({
  onSubmit,
  parentId,
  categoryId,
  setReplyingTo,
}: CommentFormProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmit(comment, parentId || undefined, categoryId || undefined);
      setComment("");
      setReplyingTo(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        {parentId ? "Répondre au post" : "Ajouter un commentaire"}
      </h3>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Écrivez votre commentaire ici..."
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out mb-4"
        rows={4}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!comment.trim()}
          className="flex items-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Send className="w-4 h-4 mr-2" />
          Envoyer
        </Button>
        <Button
          onClick={() => setReplyingTo(null)}
          className="flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Annuler
        </Button>
      </div>
    </form>
  );
}
