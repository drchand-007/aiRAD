import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
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
        Underline,
        Subscript,
        Superscript,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-indigo-400 underline cursor-pointer hover:text-indigo-300',
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder: "Start dictating or paste findings here…",
          emptyEditorClass: "text-slate-500 italic",
        }),
      ],
      content,
      editorProps: {
        attributes: {
          class:
            "tiptap min-h-[400px] outline-none prose prose-slate dark:prose-invert max-w-none focus-visible:ring-2 ring-primary rounded-b-lg bg-card p-6 text-foreground shadow-inner",
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
    <div className="rounded-lg border border-border overflow-hidden bg-card shadow-sm">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} aria-label="Findings editor" />
    </div>
  );
}
