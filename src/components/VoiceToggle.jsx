import React from "react";
import { Mic } from "lucide-react";
import Button from "./Button.jsx";

export default function VoiceToggle({ status, onToggle, supported, interim }) {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-center">
      <Button
        variant="secondary"
        icon
        onClick={onToggle}
        aria-label="Toggle voice dictation"
        disabled={!supported}
        className={`${
          status === "listening" ? "animate-pulse bg-red-600 hover:bg-red-700" : ""
        } w-16 h-16 rounded-full shadow-lg`}
      >
        <Mic size={28} />
      </Button>
      {status === "listening" && (
        <div className="mt-2 text-xs bg-gray-800 text-white px-3 py-2 rounded-lg max-w-xs text-center">
          <p className="font-semibold">Listening…</p>
          {interim && <p className="italic mt-1">{interim}</p>}
        </div>
      )}
    </div>
  );
}
