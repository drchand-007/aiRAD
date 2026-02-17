import React from "react";
import { XCircle, Zap } from "lucide-react";

export default function ShortcutsHelpModal({ shortcuts = {}, onClose }) {
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");
  const mod = isMac ? "⌘" : "Ctrl";
  const alt = isMac ? "⌥" : "Alt";
  const Key = ({ k }) => (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded">
      {k}
    </kbd>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-slate-900 rounded-none md:rounded-2xl shadow-2xl w-full h-full md:h-auto md:max-w-2xl md:max-h-[90vh] flex flex-col border border-slate-700">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap size={20} /> Keyboard Shortcuts
          </h3>
          <button onClick={onClose}>
            <XCircle />
          </button>
        </div>
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(shortcuts).map(([action, cfg]) => (
            <div key={action} className="flex justify-between items-center">
              <span className="opacity-90">{cfg.label}</span>
              <div className="flex items-center gap-1">
                {cfg.ctrlOrCmd && <Key k={mod} />}
                {cfg.alt && <Key k={alt} />}
                <Key k={cfg.key.toUpperCase()} />
              </div>
            </div>
          ))}
          {!Object.keys(shortcuts).length && (
            <div className="opacity-70 text-sm">No shortcuts configured.</div>
          )}
        </div>
      </div>
    </div>
  );
}
