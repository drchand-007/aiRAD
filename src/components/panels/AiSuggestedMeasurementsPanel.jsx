// import React from "react";
// import { XCircle, Plus, Zap } from "lucide-react";

// export default function AiSuggestedMeasurementsPanel({
//   measurements = [],
//   onInsert,
//   onClear,
// }) {
//   if (!measurements || measurements.length === 0) return null;
//   return (
//     <div className="bg-indigo-900/20 p-4 rounded-2xl border border-indigo-700 mt-6">
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-lg font-semibold flex items-center gap-2">
//           <Zap size={18} />
//           AI-Suggested Measurements
//         </h3>
//         <button onClick={onClear} className="text-slate-300 hover:text-white">
//           <XCircle size={20} />
//         </button>
//       </div>
//       <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
//         {measurements.map((m, i) => (
//           <div
//             key={`${m.label || m.finding}-${i}`}
//             className="bg-slate-800 p-3 rounded-lg flex items-center justify-between"
//           >
//             <div>
//               <span className="font-semibold">
//                 {m.label || m.finding || "Measurement"}:
//               </span>
//               <span className="ml-2 opacity-80">{m.value}</span>
//             </div>
//             <button
//               onClick={() => onInsert?.(m.label || m.finding, m.value)}
//               className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1"
//             >
//               <Plus size={14} />
//               Insert
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { Zap, XCircle, Plus } from 'lucide-react';

export default function AiSuggestedMeasurementsPanel({ measurements, onInsert, onClear }) {
  if (!measurements || measurements.length === 0) return null;
  return (
    <div className="bg-blue-50 p-4 rounded-2xl shadow-lg border border-blue-200 mt-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-blue-700 flex items-center">
          <Zap size={20} className="mr-2" />AI-Suggested Measurements
        </h3>
        <button onClick={onClear} className="text-gray-500 hover:text-gray-800">
          <XCircle size={22} />
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {measurements.map((item, index) => (
          <div key={index} className="bg-white p-3 rounded-lg flex items-center justify-between shadow-sm">
            <div>
              <span className="font-semibold text-gray-800">{item.finding}:</span>
              <span className="ml-2 text-gray-600">{item.value}</span>
            </div>
            <button
              onClick={() => onInsert(item.finding, item.value)}
              className="bg-blue-100 text-blue-800 font-bold py-1 px-3 rounded-lg hover:bg-blue-200 transition text-sm flex items-center"
            >
              <Plus size={16} className="mr-1" /> Insert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
