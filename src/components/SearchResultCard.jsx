import React from "react";
import Button from "./Button.jsx";

export default function SearchResultCard({
  index,
  result,
  onInsert,
  tone = "indigo", // indigo | purple etc.
}) {
  return (
    <div
      className={`relative p-4 bg-${tone}-50 border border-${tone}-200 rounded-lg space-y-2`}
    >
      <span
        className={`absolute top-2 right-2 h-6 w-6 rounded-full bg-${tone}-200 text-${tone}-800 font-bold flex items-center justify-center text-xs`}
      >
        {index + 1}
      </span>
      <h4 className={`font-bold text-${tone}-800`}>{result.findingName}</h4>
      <p className="text-sm">
        <strong>ORGAN:</strong> {result.organ}
      </p>
      <p className="text-sm">
        <strong>FINDINGS:</strong> {result.findings}
      </p>
      <p className="text-sm">
        <strong>IMPRESSION:</strong> {result.impression}
      </p>
      <Button
        className="w-full mt-2"
        variant="secondary"
        onClick={() => onInsert(result)}
      >
        Insert
      </Button>
    </div>
  );
}
