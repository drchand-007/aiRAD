import React, { useRef } from "react";
import Button from "./Button.jsx";
import useFocusTrap from "../hooks/useFocusTrap.js";

export default function SuggestionsModal({
  isOpen,
  onClose,
  heading,
  content,
  onAppend,
  loading,
}) {
  const ref = useRef(null);
  useFocusTrap(ref, isOpen);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div ref={ref} className="bg-white w-full max-w-2xl rounded-2xl shadow-lg flex flex-col max-h-[90vh]">
        <header className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{heading}</h2>
        </header>
        <main className="p-6 overflow-y-auto flex-grow text-gray-700 whitespace-pre-wrap">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-10 w-10 border-b-2 border-gray-900 rounded-full" />
            </div>
          ) : (
            content
          )}
        </main>
        <footer className="p-4 border-t flex justify-end space-x-3 bg-gray-50 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {onAppend && (
            <Button onClick={onAppend} variant="primary">
              Append to Report
            </Button>
          )}
        </footer>
      </div>
    </div>
  );
}
