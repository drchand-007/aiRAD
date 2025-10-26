// import React, { useMemo, useState } from "react";
// import { Search, PlusCircle, BrainCircuit } from "lucide-react";
// import { localFindings } from "../../findings";

// function previewText(item) {
//   const imp = (item.impression || "").trim();
//   if (imp && imp !== ".") return imp;
//   const raw = (item.findings || "").replace(/\s+/g, " ").trim();
//   const text = raw.replace(/<[^>]+>/g, "");
//   return text.slice(0, 140) + (text.length > 140 ? "…" : "");
// }

// function buildInsertHTML(item) {
//   const title = item.findingName || item.conditionName || item.name || "Untitled";
//   if (item.isFullReport && item.findings) return String(item.findings);
//   const f = (item.findings || "").toString().trim();
//   const i = (item.impression || "").toString().trim();
//   let html = `<h3>${title}</h3>`;
//   if (f) html += f.startsWith("<") ? f : `<p>${f}</p>`;
//   if (i && i !== ".") html += `<p><strong>Impression:</strong> ${i}</p>`;
//   return html;
// }

// export default function KnowledgeLookupPanel({ onInsert }) {
//   const [q, setQ] = useState("");

//   const results = useMemo(() => {
//     const term = (q || "").trim().toLowerCase();
//     if (!term) return [];
//     return (localFindings || []).filter((f) => {
//       const name = (f.findingName || f.conditionName || f.name || "").toLowerCase();
//       const organ = (f.organ || "").toLowerCase();
//       const syns = Array.isArray(f.synonyms)
//         ? f.synonyms.map((s) => (s || "").toLowerCase())
//         : [];
//       return (
//         name.includes(term) ||
//         organ.includes(term) ||
//         syns.some((s) => s.includes(term))
//       );
//     });
//   }, [q]);

//   return (
//     <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4">
//       <div className="flex items-center gap-2 mb-3">
//         <BrainCircuit size={18} />
//         <div className="font-semibold">Knowledge Lookup</div>
//       </div>

//       <div className="flex gap-2 mb-3">
//         <input
//           className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2"
//           placeholder="Search local findings…"
//           value={q}
//           onChange={(e) => setQ(e.target.value)}
//         />
//         <button
//           className="px-3 py-2 bg-slate-700 rounded-lg"
//           onClick={() => setQ(q)}
//         >
//           <Search size={16} />
//         </button>
//       </div>

//       <div className="space-y-3">
//         {results.map((r, i) => {
//           const title = r.findingName || r.conditionName || r.name || "Untitled";
//           return (
//             <div key={`${title}-${i}`} className="p-3 rounded-lg bg-slate-700/50">
//               <div className="font-semibold">{title}</div>
//               {r.organ && (
//                 <div className="text-xs opacity-70 mt-0.5">{r.organ}</div>
//               )}
//               <div className="text-sm opacity-80 mt-2">{previewText(r)}</div>
//               <button
//                 className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-lg flex items-center justify-center"
//                 onClick={() => onInsert?.(buildInsertHTML(r))}
//               >
//                 <PlusCircle size={18} className="mr-2" /> Insert into Report
//               </button>
//             </div>
//           );
//         })}
//         {q && results.length === 0 && (
//           <div className="text-slate-400 text-sm">No matches.</div>
//         )}
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { BrainCircuit, XCircle, BookOpen, Link as LinkIcon, PlusCircle } from 'lucide-react';

export default function KnowledgeLookupPanel({ result, onClose, onInsert }) {
  if (!result) return null;
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-700 flex items-center">
          <BrainCircuit className="mr-3 text-green-500" />
          Knowledge Lookup: {result.conditionName}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <XCircle size={24} />
        </button>
      </div>

      <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Summary</h3>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: result.summary }} />
        </div>

        {result.keyImagingFeatures?.length > 0 && (
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Key Imaging Features</h3>
            <ul className="list-disc list-inside space-y-1 text-sm prose prose-sm max-w-none">
              {result.keyImagingFeatures.map((feature, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: feature.replace(/<\/?li>/g, '') }} />
              ))}
            </ul>
          </div>
        )}

        {result.differentialDiagnosis?.length > 0 && (
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Differential Diagnosis</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {result.differentialDiagnosis.map((dx, i) => (<li key={i}>{dx}</li>))}
            </ul>
          </div>
        )}

        {result.sources?.length > 0 && (
          <div>
            <h4 className="font-bold text-gray-700 mt-4 mb-2 flex items-center"><BookOpen size={16} className="mr-2"/>Sources</h4>
            <ul className="list-disc list-inside space-y-1 text-xs">
              {result.sources.map((source, i) => (
                <li key={i}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {source.name} <LinkIcon size={12} className="inline-block ml-1"/>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <button
          onClick={() => {
            const contentToInsert = `
              <h3>${result.conditionName}</h3>
              <h4>Summary</h4>
              ${result.summary}
              <h4>Key Imaging Features</h4>
              <ul>${result.keyImagingFeatures?.join('') || ''}</ul>
            `;
            onInsert(contentToInsert);
          }}
          className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition flex items-center justify-center"
        >
          <PlusCircle size={18} className="mr-2" /> Insert into Report
        </button>
      </div>
    </div>
  );
}

