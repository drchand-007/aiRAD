import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar.jsx";

/**
 * Thin wrapper around TipTap so heavy libs can be **lazy‑loaded** via React.lazy.
 *
 * Props:
 *  - `content`   → HTML string for initial / controlled content.
 *  - `onUpdate`  → (editor) => void; fires on each change.
 */
export default function EditorPane({ content = "", onUpdate }) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: "Start dictating or paste findings here…",
          emptyEditorClass: "text-neutral-400 italic",
        }),
      ],
      content,
      editorProps: {
        attributes: {
          class:
            "tiptap min-h-[250px] outline-none prose max-w-none focus-visible:ring-2 ring-brandTeal rounded-b-lg bg-white p-2",
        },
      },
      onUpdate({ editor }) {
        onUpdate?.(editor);
      },
    },
    [onUpdate]
  );

  // Keep external `content` prop authoritative.
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null; // While lazy bundle loads

  return (
    <div className="rounded-lg border border-gray-300 overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} aria-label="Findings editor" />
    </div>
  );
}
