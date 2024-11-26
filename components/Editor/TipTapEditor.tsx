"use client";

import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { MenuBarTipTap } from "./MenuBarTipTap";

export const extensions = [
  StarterKit.configure({}),
  BulletList.configure({
    HTMLAttributes: {
      class: "list-disc pl-5 space-y-2",
    },
  }),
  CodeBlock.configure({
    HTMLAttributes: {
      class: "bg-gray-100 rounded-md p-4 font-mono text-sm",
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class: "pl-4 border-l-4 border-gray-300 italic",
    },
  }),
  Image,
  Link.configure({
    openOnClick: false,
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Écrivez votre message ici...",
  }),
  TextStyle,
  Color,
];

interface TipTapEditorProps {
  content: string;
  onChange: (content: string, json: JSONContent) => void;
  setJsonContent: (json: JSONContent) => void;
}

export default function TipTapEditor({
  content,
  onChange,
  setJsonContent,
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose focus:outline-none min-h-[200px] px-3",
      },
    },
    onUpdate: ({ editor }) => {
      const htmlContent = editor.getHTML();
      const jsonContent = editor.getJSON();
      onChange(htmlContent, jsonContent);
      setJsonContent(jsonContent);
    },
  });

  return (
    <div className="rounded-md border">
      <MenuBarTipTap editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
