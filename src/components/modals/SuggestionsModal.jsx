import React from "react";
import { X } from "lucide-react";

export default function SuggestionsModal({ open, title, html, onInsert, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border max-w-3xl w-full rounded-2xl shadow-2xl">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="font-semibold text-foreground">{title}</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div
          className="p-4 max-h-[60vh] overflow-y-auto prose dark:prose-invert text-foreground"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="p-4 border-t border-border flex gap-2 justify-end">
          <button
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-semibold shadow-sm"
            onClick={onInsert}
          >
            Insert
          </button>
          <button
            className="bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 px-4 py-2 rounded-lg border border-border shadow-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
