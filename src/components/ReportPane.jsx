import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar.jsx";

/**
 * Thin wrapper around TipTap so the heavy libs can be lazily imported
 * via React.lazy. The parent supplies `content` and an `onUpdate`
 * callback that receives the editor instance so the parent can read
 * HTML / text or issue commands.
 */
export default function EditorPane({ content, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start dictating or paste findings here…",
        emptyEditorClass: "text-neutral-400 italic",
      }),
    ],
    content,
    onUpdate: ({ editor }) => onUpdate?.(editor),
  });

  /* destroy on unmount to avoid memory‑leak warnings */
  useEffect(() => () => editor?.destroy(), [editor]);

  if (!editor) {
    return (
      <div className="h-40 animate-pulse bg-gray-100 rounded-lg" role="status" aria-busy="true" />
    );
  }

  return (
    <div className="rounded-lg bg-white border border-gray-300">
      <MenuBar editor={editor} />
      <EditorContent
        editor={editor}
        aria-label="Findings editor"
        className="tiptap min-h-[250px] p-2 focus:outline-none"
      />
    </div>
  );
}
