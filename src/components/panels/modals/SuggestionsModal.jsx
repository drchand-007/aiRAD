import React from "react";
import { X } from "lucide-react";

export default function SuggestionsModal({ open, title, html, onInsert, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-3xl w-full rounded-2xl shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <div
          className="p-4 max-h-[60vh] overflow-y-auto prose prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <div className="p-4 border-t border-slate-700 flex gap-2 justify-end">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold"
            onClick={onInsert}
          >
            Insert
          </button>
          <button
            className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
