import React, { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

export default function MacroModal({ macros = [], onCreate, onDelete, onClose }) {
  const [cmd, setCmd] = useState("");
  const [txt, setTxt] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-700 shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Voice Macros</h3>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 gap-2">
            <input
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
              placeholder="Macro command (e.g. 'insert normal liver')"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
            />
            <textarea
              rows={4}
              className="bg-slate-800 border border-slate-700 rounded px-3 py-2"
              placeholder="Inserted text (HTML or plain)"
              value={txt}
              onChange={(e) => setTxt(e.target.value)}
            />
            <button
              className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg font-semibold flex items-center gap-1 w-max"
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
                className="bg-slate-800 border border-slate-700 rounded p-3 flex items-center justify-between"
              >
                <div className="min-w-0 pr-3">
                  <div className="font-semibold truncate">{m.command}</div>
                  <div className="text-sm opacity-80 line-clamp-2 break-words">
                    {m.text}
                  </div>
                </div>
                <button
                  className="text-red-400 hover:text-red-300"
                  onClick={() => onDelete?.(m.id)}
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {!macros.length && (
              <div className="text-sm opacity-70">No macros yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
