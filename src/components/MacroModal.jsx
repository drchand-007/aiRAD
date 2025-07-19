/* --------------------------------------------------------------------------
   src/components/MacroModal.jsx
   -------------------------------------------------------------------------- */

import React, { useState, useRef, useEffect } from "react";
import { XCircle, Trash2 } from "lucide-react";
import Button from "./Button.jsx";
import useFocusTrap from "../hooks/useFocusTrap.js";

/**
 * @param {boolean}  open       – is sheet visible?
 * @param {Function} onClose    – callback to close sheet
 * @param {Array<{command:string,text:string}>} macros
 * @param {Function} setMacros  – parent setter
 */
export default function MacroModal({ open, onClose, macros, setMacros }) {
  /* ────────────────────────────────── state ───────────────────────────────── */
  const [newCommand, setNewCommand] = useState("");
  const [newText, setNewText]       = useState("");

  /* ───────────────────────────── focus-trap / Esc ────────────────────────── */
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  /* ────────────────────────────── helpers ─────────────────────────────────── */
  const addMacro = () => {
    if (!newCommand.trim() || !newText.trim()) return;
    setMacros([...macros, { command: newCommand.trim(), text: newText.trim() }]);
    setNewCommand("");
    setNewText("");
  };
  const deleteMacro = (idx) => setMacros(macros.filter((_, i) => i !== idx));

  /* ───────────────────────────── render ───────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="macro-modal-title"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* header */}
        <header className="flex items-center justify-between p-6 border-b">
          <h2 id="macro-modal-title" className="text-2xl font-bold">
            Manage&nbsp;Voice Macros
          </h2>
          <button
            aria-label="Close macro modal"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-brandTeal rounded-full p-1"
          >
            <XCircle size={24} />
          </button>
        </header>

        {/* body */}
        <section className="flex-grow overflow-y-auto p-6 space-y-10">
          {/* add new */}
          <div>
            <h3 className="font-semibold mb-4">Add&nbsp;New&nbsp;Macro</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={newCommand}
                onChange={(e) => setNewCommand(e.target.value)}
                placeholder='Voice command (e.g. "normal abdomen")'
                className="border rounded-lg p-2 w-full"
              />
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={3}
                placeholder="Text to insert"
                className="border rounded-lg p-2 w-full md:col-span-2"
              />
            </div>
            <Button onClick={addMacro} className="mt-3">
              Add&nbsp;Macro
            </Button>
          </div>

          {/* list existing */}
          <div>
            <h3 className="font-semibold mb-4">Existing&nbsp;Macros</h3>
            {macros.length === 0 && (
              <p className="text-sm text-gray-500">No macros yet.</p>
            )}

            <ul className="space-y-2">
              {macros.map((m, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg"
                >
                  <div className="pr-2 overflow-hidden">
                    <p className="font-medium truncate max-w-[32ch]">
                      {m.command}
                    </p>
                    <p className="text-sm text-gray-600 truncate max-w-[40ch]">
                      {m.text}
                    </p>
                  </div>
                  <button
                    aria-label="Delete macro"
                    onClick={() => deleteMacro(idx)}
                    className="text-red-500 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-brandTeal rounded-full p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* footer */}
        <footer className="border-t p-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
}
