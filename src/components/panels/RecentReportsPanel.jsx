// import React, { useEffect, useState } from "react";
// import CollapsibleSection from "../ui/CollapsibleSection";
// import { History } from "lucide-react";
// import {
//   collection,
//   onSnapshot,
//   orderBy,
//   limit,
//   query,
// } from "firebase/firestore";
// import { db } from "../../firebase";

// export default function RecentReportsPanel({ user, onSelectReport }) {
//   const [recent, setRecent] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!user) {
//       setRecent([]);
//       setLoading(false);
//       return;
//     }
//     const q = query(
//       collection(db, "users", user.uid, "reports"),
//       orderBy("createdAt", "desc"),
//       limit(5)
//     );
//     const unsub = onSnapshot(
//       q,
//       (snap) => {
//         const items = [];
//         snap.forEach((d) => items.push({ id: d.id, ...d.data() }));
//         setRecent(items);
//         setLoading(false);
//       },
//       () => setLoading(false)
//     );
//     return () => unsub();
//   }, [user]);

//   return (
//     <CollapsibleSection title="Recent Reports" icon={History}>
//       {loading ? (
//         <p className="opacity-70">Loading recent reports...</p>
//       ) : recent.length ? (
//         <div className="space-y-2">
//           {recent.map((r) => (
//             <button
//               key={r.id}
//               onClick={() => onSelectReport?.(r)}
//               className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
//             >
//               <p className="font-semibold">{r.patientName || "Report"}</p>
//               <p className="text-sm opacity-70">
//                 {r.examDate || ""}{" "}
//                 {r.createdAt?.seconds
//                   ? `— ${new Date(r.createdAt.seconds * 1000).toLocaleDateString()}`
//                   : ""}
//               </p>
//             </button>
//           ))}
//         </div>
//       ) : (
//         <p className="opacity-70">No recent reports found.</p>
//       )}
//     </CollapsibleSection>
//   );
// }

import React, { useEffect, useState } from "react";
import { History } from "lucide-react";
import { toast } from "react-hot-toast";
import CollapsibleSection from "../common/CollapsibleSection";
import { listenRecentReports } from "../../api/reportService";

export default function RecentReportsPanel({ onSelectReport, user }) {
  const [recentReports, setRecentReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = listenRecentReports(
      user.uid,
      5,
      (reports) => { setRecentReports(reports); setIsLoading(false); },
      (err) => { console.error("Error fetching recent reports:", err); toast.error("Could not fetch recent reports."); setIsLoading(false); }
    );
    return () => unsub && unsub();
  }, [user]);

  return (
    <CollapsibleSection title="Recent Reports" icon={History}>
      {isLoading ? (
        <p>Loading recent reports...</p>
      ) : recentReports.length > 0 ? (
        <div className="space-y-2">
          {recentReports.map(report => (
            <button
              key={report.id}
              onClick={() => onSelectReport(report)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border transition"
            >
              <p className="font-semibold">{report.patientName}</p>
              <p className="text-sm text-gray-500">
                {report.examDate}{" "}
                {report.createdAt?.seconds ? `- ${new Date(report.createdAt.seconds * 1000).toLocaleDateString()}` : ""}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent reports found.</p>
      )}
    </CollapsibleSection>
  );
}
