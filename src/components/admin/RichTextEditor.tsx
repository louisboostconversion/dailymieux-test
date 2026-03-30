"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  ImageIcon,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Ecrivez votre contenu ici...",
}: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false);
  const lastEmitted = useRef(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      TiptapImage,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      editor.commands.setContent(value || "", false);
      lastEmitted.current = value;
    }
  }, [value, editor]);

  if (!mounted || !editor) {
    return (
      <div className="rounded-lg border border-gray-300 px-4 py-3 min-h-[120px] bg-gray-50 text-sm text-gray-400">
        Chargement de l&apos;editeur...
      </div>
    );
  }

  function addLink() {
    const url = prompt("URL du lien :");
    if (url) {
      editor!.chain().focus().setLink({ href: url }).run();
    }
  }

  function addImage() {
    const url = prompt("URL de l'image :");
    if (url) {
      editor!.chain().focus().setImage({ src: url }).run();
    }
  }

  const btn = (active: boolean) =>
    `rounded p-1.5 transition-colors ${
      active
        ? "bg-[#2D5A3D]/10 text-[#2D5A3D]"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <div className="rounded-lg border border-gray-300 focus-within:border-[#2D5A3D] focus-within:ring-2 focus-within:ring-[#2D5A3D]/20">
      <div className="flex flex-wrap gap-0.5 border-b border-gray-200 px-2 py-1.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive("bold"))} title="Gras">
          <Bold className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive("italic"))} title="Italique">
          <Italic className="h-4 w-4" />
        </button>
        <div className="mx-1 w-px bg-gray-200" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive("heading", { level: 2 }))} title="Titre H2">
          <Heading2 className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive("heading", { level: 3 }))} title="Titre H3">
          <Heading3 className="h-4 w-4" />
        </button>
        <div className="mx-1 w-px bg-gray-200" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive("bulletList"))} title="Liste">
          <List className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive("orderedList"))} title="Liste numerotee">
          <ListOrdered className="h-4 w-4" />
        </button>
        <div className="mx-1 w-px bg-gray-200" />
        <button type="button" onClick={addLink} className={btn(editor.isActive("link"))} title="Lien">
          <LinkIcon className="h-4 w-4" />
        </button>
        <button type="button" onClick={addImage} className={btn(false)} title="Image">
          <ImageIcon className="h-4 w-4" />
        </button>
        <div className="mx-1 w-px bg-gray-200" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} title="Annuler">
          <Undo className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} title="Retablir">
          <Redo className="h-4 w-4" />
        </button>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none px-4 py-3 min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[100px]"
      />
    </div>
  );
}
