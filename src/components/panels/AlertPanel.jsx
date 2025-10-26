// import React from "react";
// import {
//   AlertTriangle,
//   CheckCircle,
//   ChevronLeft,
//   XCircle,
//   PlusCircle,
//   Copy,
// } from "lucide-react";

// export default function AlertPanel({
//   alertData,
//   onAcknowledge,
//   onInsertMacro,
//   onPrepareNotification,
//   onFix,
//   onProceed,
// }) {
//   if (!alertData) return null;

//   const map = {
//     critical: {
//       bg: "bg-red-900/30",
//       border: "border-red-500",
//       text: "text-red-200",
//       icon: "text-red-400",
//       Icon: AlertTriangle,
//       title: `Critical Finding Detected${
//         alertData.data?.findingName ? `: ${alertData.data.findingName}` : ""
//       }`,
//       message:
//         alertData.message ||
//         "Please review and take appropriate action immediately.",
//     },
//     inconsistency: {
//       bg: "bg-yellow-900/30",
//       border: "border-yellow-500",
//       text: "text-yellow-200",
//       icon: "text-yellow-400",
//       Icon: AlertTriangle,
//       title: "Inconsistency Detected",
//       message: alertData.message || "Please check findings vs impression.",
//     },
//     missing_info: {
//       bg: "bg-orange-900/30",
//       border: "border-orange-500",
//       text: "text-orange-200",
//       icon: "text-orange-400",
//       Icon: AlertTriangle,
//       title: "Incomplete Report",
//       message: alertData.message || "Some values are missing.",
//     },
//   };

//   const c = map[alertData.type];
//   if (!c) return null;

//   const Btn = (cls, children, onClick) => (
//     <button
//       onClick={onClick}
//       className={`${cls} font-semibold py-1 px-3 rounded-lg transition text-sm`}
//     >
//       {children}
//     </button>
//   );

//   return (
//     <div
//       className={`${c.bg} border-l-4 ${c.border} ${c.text} p-4 rounded-lg shadow-md`}
//       role="alert"
//     >
//       <div className="flex items-start gap-3">
//         <c.Icon className={`h-6 w-6 ${c.icon} mt-0.5`} />
//         <div className="flex-grow">
//           <p className="font-bold">{c.title}</p>
//           <p className="text-sm opacity-90">{c.message}</p>
//           <div className="mt-3 flex flex-wrap gap-2">
//             {alertData.type === "critical" && (
//               <>
//                 {Btn(
//                   "bg-red-600 hover:bg-red-700 text-white flex items-center gap-1",
//                   <>
//                     <PlusCircle size={16} /> Add to Report
//                   </>,
//                   onInsertMacro
//                 )}
//                 {Btn(
//                   "bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-1",
//                   <>
//                     <Copy size={16} /> Prepare Notification
//                   </>,
//                   onPrepareNotification
//                 )}
//               </>
//             )}
//             {alertData.type === "inconsistency" && (
//               <>
//                 {Btn(
//                   "bg-green-600 hover:bg-green-700 text-white flex items-center gap-1",
//                   <>
//                     <CheckCircle size={16} /> Fix Issue
//                   </>,
//                   onFix
//                 )}
//                 {Btn(
//                   "bg-slate-200 text-slate-800 hover:bg-slate-300 flex items-center gap-1",
//                   <>
//                     <XCircle size={16} /> Ignore
//                   </>,
//                   onAcknowledge
//                 )}
//               </>
//             )}
//             {alertData.type === "missing_info" && (
//               <>
//                 {Btn(
//                   "bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1",
//                   <>
//                     <CheckCircle size={16} /> Proceed Anyway
//                   </>,
//                   onProceed
//                 )}
//                 {Btn(
//                   "bg-slate-200 text-slate-800 hover:bg-slate-300 flex items-center gap-1",
//                   <>
//                     <ChevronLeft size={16} /> Go Back
//                   </>,
//                   onAcknowledge
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//         {(alertData.type === "critical" ||
//           alertData.type === "missing_info") && (
//           <button onClick={onAcknowledge} className={`${c.icon} hover:${c.text}`}>
//             <XCircle size={22} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import React from 'react';
import { AlertTriangle, PlusCircle, Copy, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

export default function AlertPanel({ alertData, onAcknowledge, onInsertMacro, onPrepareNotification, onFix, onProceed }) {
  if (!alertData) return null;
  const isCritical = alertData.type === 'critical';
  const isFixable = alertData.type === 'inconsistency';
  const isMissingInfo = alertData.type === 'missing_info';

  const config = {
    critical: { bgColor:'bg-red-50', borderColor:'border-red-500', textColor:'text-red-800', iconColor:'text-red-500', Icon: AlertTriangle,
      message:'Please review and take appropriate action immediately.' },
    inconsistency: { bgColor:'bg-yellow-50', borderColor:'border-yellow-500', textColor:'text-yellow-800', iconColor:'text-yellow-500', Icon: AlertTriangle,
      title:'Inconsistency Detected', message: alertData.message },
    missing_info: { bgColor:'bg-orange-50', borderColor:'border-orange-500', textColor:'text-orange-800', iconColor:'text-orange-500', Icon: AlertTriangle,
      title:'Incomplete Report', message: alertData.message },
  };

  const currentConfig = config[alertData.type];
  if (!currentConfig) return null;
  const title = isCritical ? `Critical Finding Detected: ${alertData.data?.findingName}` : currentConfig.title;

  return (
    <div className={`${currentConfig.bgColor} border-l-4 ${currentConfig.borderColor} ${currentConfig.textColor} p-4 rounded-lg shadow-md mb-4`} role="alert">
      <div className="flex items-start">
        <div className="py-1"><currentConfig.Icon className={`h-6 w-6 ${currentConfig.iconColor} mr-4`} /></div>
        <div className="flex-grow">
          <p className="font-bold">{title}</p>
          <p className="text-sm">{currentConfig.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {isCritical && (
              <>
                <button onClick={onInsertMacro} className="bg-red-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700 transition text-sm flex items-center">
                  <PlusCircle size={16} className="mr-1.5" /> Add to Report
                </button>
                <button onClick={onPrepareNotification} className="bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-yellow-600 transition text-sm flex items-center">
                  <Copy size={16} className="mr-1.5" /> Prepare Notification
                </button>
              </>
            )}
            {isFixable && (
              <>
                <button onClick={onFix} className="bg-green-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-700 transition text-sm flex items-center">
                  <CheckCircle size={16} className="mr-1.5" /> Fix Issue
                </button>
                <button onClick={onAcknowledge} className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center">
                  <XCircle size={16} className="mr-1.5" /> Ignore
                </button>
              </>
            )}
            {isMissingInfo && (
              <>
                <button onClick={onProceed} className="bg-orange-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-orange-700 transition text-sm flex items-center">
                  <CheckCircle size={16} className="mr-1.5" /> Proceed Anyway
                </button>
                <button onClick={onAcknowledge} className="bg-gray-200 text-gray-800 font-bold py-1 px-3 rounded-lg hover:bg-gray-300 transition text-sm flex items-center">
                  <ChevronLeft size={16} className="mr-1.5" /> Go Back
                </button>
              </>
            )}
          </div>
        </div>
        {(isCritical || isMissingInfo) && (
          <button onClick={onAcknowledge} className={`ml-4 ${currentConfig.iconColor}`}>
            <XCircle size={22} />
          </button>
        )}
      </div>
    </div>
  );
}
