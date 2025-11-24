
"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TiptapEditor = ({ value, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    content: value,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Bold,
      BulletList,
      OrderedList,
      ListItem,
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] focus:outline-none prose prose-sm sm:prose-base max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when prop changes (external set)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="border bg-white rounded-md p-2">
      <EditorContent editor={editor} />
    </div>
  );
};
