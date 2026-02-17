import React from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough, // changed from Pilcrow to Strikethrough for better utility
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Superscript,
  Subscript,
  Undo,
  Redo,
  Link as LinkIcon,
  Code
} from "lucide-react";

export default function MenuBar({ editor }) {
  if (!editor) return null;

  const ToolbarGroup = ({ children }) => (
    <div className="flex items-center gap-0.5 md:gap-1 px-1 py-1 md:px-2 md:py-1.5 bg-background/50 rounded-lg border border-border hover:border-primary/20 transition-colors flex-shrink-0">
      {children}
    </div>
  );

  const ToolbarButton = ({ onClick, isActive, disabled, icon: Icon, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-1.5 md:p-2 rounded-md transition-all duration-200 flex items-center justify-center
        ${isActive
          ? "bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/50"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
    </button>
  );

  const Separator = () => <div className="w-[1px] h-6 bg-border mx-1" />;

  return (
    <div className="flex flex-nowrap items-center gap-1 md:gap-2 p-1 md:p-3 bg-secondary/50 border-b border-border overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 shrink-0">

      {/* HISTORY */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          icon={Undo}
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          icon={Redo}
          title="Redo"
        />
      </ToolbarGroup>

      <Separator />

      {/* TEXT FORMATTING */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          icon={Bold}
          title="Bold"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          icon={Italic}
          title="Italic"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
          icon={Underline}
          title="Underline"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
          icon={Strikethrough}
          title="Strikethrough"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive("subscript")}
          icon={Subscript}
          title="Subscript"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          isActive={editor.isActive("superscript")}
          icon={Superscript}
          title="Superscript"
        />
      </ToolbarGroup>

      <Separator />

      {/* ALIGNMENT */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
          icon={AlignLeft}
          title="Align Left"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
          icon={AlignCenter}
          title="Align Center"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
          icon={AlignRight}
          title="Align Right"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          isActive={editor.isActive({ textAlign: "justify" })}
          icon={AlignJustify}
          title="Justify"
        />
      </ToolbarGroup>

      <Separator />

      {/* LISTS & OTHERS */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          icon={List}
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          icon={ListOrdered}
          title="Ordered List"
        />
        <ToolbarButton
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)
            if (url === null) return
            if (url === '') {
              editor.chain().focus().extendMarkRange('link').unsetLink().run()
              return
            }
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
          }}
          isActive={editor.isActive("link")}
          icon={LinkIcon}
          title="Hyperlink"
        />
      </ToolbarGroup>
    </div>
  );
}
