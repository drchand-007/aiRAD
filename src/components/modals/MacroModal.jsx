import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

export default function MacroModal({ macros = [], onCreate, onDelete, onClose }) {
  const [cmd, setCmd] = useState("");
  const [txt, setTxt] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-xl rounded-2xl border border-border shadow-2xl">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Voice Macros</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <input
              className="bg-background border border-input text-foreground rounded px-3 py-2 placeholder:text-muted-foreground"
              placeholder="Macro command (e.g. 'insert normal liver')"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
            />
            <textarea
              rows={4}
              className="bg-background border border-input text-foreground rounded px-3 py-2 placeholder:text-muted-foreground"
              placeholder="Inserted text (HTML or plain)"
              value={txt}
              onChange={(e) => setTxt(e.target.value)}
            />
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-lg font-semibold flex items-center gap-1 w-max"
              onClick={() => {
                if (!cmd.trim() || !txt.trim()) return;
                onCreate?.(cmd.trim(), txt);
                setCmd("");
                setTxt("");
              }}
            >
              <Plus size={16} /> Add Macro
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {macros.map((m) => (
              <div
                key={m.id}
                className="bg-card border border-border rounded p-3 flex items-center justify-between"
              >
                <div className="min-w-0 pr-3">
                  <div className="font-semibold truncate text-foreground">{m.command}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2 break-words">
                    {m.text}
                  </div>
                </div>
                <button
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => onDelete?.(m.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!macros.length && (
              <div className="text-sm text-muted-foreground">No macros yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
