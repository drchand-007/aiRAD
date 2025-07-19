import React from "react";

export default function Loader({ rows = 3 }) {
  return (
    <div role="status" aria-busy="true" className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 rounded w-full" />
      ))}
    </div>
  );
}
