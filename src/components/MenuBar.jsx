import React from "react";
import {
  Bold,
  Italic,
  Pilcrow,
  List,
  ListOrdered,
} from "lucide-react";
import Button from "./Button.jsx";

export default function MenuBar({ editor }) {
  if (!editor) return null;

  const btn = (icon, onClick, isActive, disabled, label) => (
    <Button
      variant="ghost"
      icon
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={isActive ? "bg-gray-300" : ""}
    >
      {icon}
    </Button>
  );

  return (
    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-t-lg border-b border-gray-300">
      {btn(
        <Bold size={16} />,
        () => editor.chain().focus().toggleBold().run(),
        editor.isActive("bold"),
        !editor.can().chain().focus().toggleBold().run(),
        "Bold"
      )}
      {btn(
        <Italic size={16} />,
        () => editor.chain().focus().toggleItalic().run(),
        editor.isActive("italic"),
        !editor.can().chain().focus().toggleItalic().run(),
        "Italic"
      )}
      {btn(
        <Pilcrow size={16} />,
        () => editor.chain().focus().setParagraph().run(),
        editor.isActive("paragraph"),
        false,
        "Paragraph"
      )}
      {btn(
        <List size={16} />,
        () => editor.chain().focus().toggleBulletList().run(),
        editor.isActive("bulletList"),
        false,
        "Bullet list"
      )}
      {btn(
        <ListOrdered size={16} />,
        () => editor.chain().focus().toggleOrderedList().run(),
        editor.isActive("orderedList"),
        false,
        "Ordered list"
      )}
    </div>
  );
}
