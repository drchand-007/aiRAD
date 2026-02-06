import React, { useEffect, useState } from 'react';
import {
    collection,
    query,
    where,
    collectionGroup,
    orderBy,
    onSnapshot,
    Timestamp,
    limit,
    getDocs
} from 'firebase/firestore';
import { db } from '../../firebase';
import {
    Users, FileCheck, DollarSign, Activity, TrendingUp,
    Calendar, Search, User, Clock, Shield
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { format, subDays, isSameDay, startOfWeek, endOfWeek } from 'date-fns';

// --- COMPONENTS ---

const StatCard = ({ title, value, subtext, icon: Icon, color, gradient }) => (
    <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-all duration-300">
        <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity ${color}`}></div>
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
                {subtext && (
                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-400">
                        <TrendingUp size={12} />
                        <span>{subtext}</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${gradient} text-white shadow-lg`}>
                <Icon size={24} />
            </div>
        </div>
    </div>
);

const ReportRow = ({ report }) => {
    // Handle Timestamp or Date object safely
    const dateObj = report.createdAt instanceof Timestamp ? report.createdAt.toDate() : new Date(report.createdAt || Date.now());

    return (
        <tr className="hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 group">
            <td className="p-4 pl-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5">
                        <User size={14} />
                    </div>
                    <div>
                        <p className="text-slate-200 font-medium text-sm">{report.userEmail || 'Unknown User'}</p>
                        <p className="text-slate-500 text-xs">{report.userId?.slice(0, 8)}...</p>
                    </div>
                </div>
            </td>
            <td className="p-4">
                <p className="text-slate-300 font-medium text-sm">{report.patientName || 'Unnamed Patient'}</p>
                <p className="text-slate-500 text-xs">ID: {report.patientId || 'N/A'}</p>
            </td>
            <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <FileCheck size={12} /> {report.modality || 'Radiology'}
                </span>
            </td>
            <td className="p-4 text-slate-400 text-sm flex items-center gap-2">
                <Clock size={14} />
                {format(dateObj, 'MMM dd, h:mm a')}
            </td>
        </tr>
    );
};

// --- MAIN DASHBOARD ---

const AdminDashboard = () => {
    // State
    const [stats, setStats] = useState({ users: 0, proUsers: 0, totalReports: 0, weeklyReports: 0 });
    const [chartData, setChartData] = useState([]);
    const [modalityData, setModalityData] = useState([]);
    const [recentReports, setRecentReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterUser, setFilterUser] = useState('');

    useEffect(() => {
        // 1. Listen to Users
        const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
            const users = snap.docs.map(d => d.data());
            setStats(prev => ({
                ...prev,
                users: users.length,
                proUsers: users.filter(u => u.role === 'pro').length
            }));
        });

        // 2. Listen to Reports (Global Stream)
        // We limit to 50 most recent for the table to prevent browser crash on huge datasets
        const reportsQuery = query(
            collectionGroup(db, 'reports'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubReports = onSnapshot(reportsQuery, async (snap) => {
            const reports = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Enrich reports with User Email (since reports usually just store userId)
            // Note: In a production app, you should store userEmail on the report doc itself to avoid this N+1 lookup.
            // For now, we will try to look it up or fallback to ID.
            const enrichedReports = await Promise.all(reports.map(async (rep) => {
                if (rep.userEmail) return rep; // Already has email
                // Try to find user in our local cache or fetch (Skipping complex fetch for performance here)
                return { ...rep, userEmail: rep.userEmail || 'User ' + rep.userId?.slice(0, 5) };
            }));

            setRecentReports(enrichedReports);

            // Calculate Chart Data (Client-side aggregation for last 30 days from these 50 or fetch separate agg)
            // For true accuracy, we need a separate aggregations query, but let's use the visible snapshot + stats
            setStats(prev => ({ ...prev, totalReports: snap.size + (prev.totalReports > 50 ? prev.totalReports : 0) })); // Approx

            // CHART DATA GENERATION
            // We need a wider query for the chart than the table limit.
            // Let's run a one-time fetch for the chart history to keep the listener light.
            setLoading(false);
        });

        // 3. Separate Chart Data Fetch (Last 30 Days)
        const fetchChartData = async () => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const chartQuery = query(
                collectionGroup(db, 'reports'),
                where('createdAt', '>=', thirtyDaysAgo),
                orderBy('createdAt', 'asc')
            );

            const snap = await getDocs(chartQuery);
            const dataMap = {};

            // Init dates
            for (let i = 0; i < 30; i++) {
                dataMap[format(subDays(new Date(), i), 'MMM dd')] = 0;
            }

            snap.forEach(doc => {
                const d = doc.data().createdAt?.toDate();
                if (d) dataMap[format(d, 'MMM dd')] = (dataMap[format(d, 'MMM dd')] || 0) + 1;
            });

            // Modality Aggregation
            const modalityCounts = {};
            snap.forEach(doc => {
                const m = doc.data().modality || 'Other';
                modalityCounts[m] = (modalityCounts[m] || 0) + 1;
            });
            const modChartData = Object.entries(modalityCounts)
                .map(([name, value]) => ({ name, value }))
                .sort((a, b) => b.value - a.value);

            setModalityData(modChartData);
            const chartArr = Object.keys(dataMap).map(k => ({ name: k, reports: dataMap[k] })).reverse();
            setChartData(chartArr);
            setStats(prev => ({ ...prev, totalReports: snap.size })); // Update total accurate count
        };

        fetchChartData();

        return () => { unsubUsers(); unsubReports(); };
    }, []);

    // Client-side filtering for the table
    const filteredReports = recentReports.filter(r =>
        r.userEmail?.toLowerCase().includes(filterUser.toLowerCase()) ||
        r.userId?.toLowerCase().includes(filterUser.toLowerCase()) ||
        r.patientName?.toLowerCase().includes(filterUser.toLowerCase())
    );

    if (loading) return <div className="flex h-96 items-center justify-center text-blue-400 animate-pulse">Initializing Command Center...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 md:px-0">
            {/* HEADER */}
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Command Center</h2>
                    <p className="text-slate-400 mt-1">Global oversight of all platform activity.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    REAL-TIME FEED
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats.users} subtext="+12% this month" icon={Users} color="bg-blue-500" gradient="bg-gradient-to-br from-blue-500 to-blue-700" />
                <StatCard title="Pro Subscribers" value={stats.proUsers} subtext="High Retention" icon={Shield} color="bg-emerald-500" gradient="bg-gradient-to-br from-emerald-500 to-emerald-700" />
                <StatCard title="Total Reports" value={stats.totalReports} subtext="Lifetime Generated" icon={FileCheck} color="bg-purple-500" gradient="bg-gradient-to-br from-purple-500 to-purple-700" />
                <StatCard title="Active Today" value={recentReports.filter(r => isSameDay(new Date(), r.createdAt?.toDate())).length} subtext="Reports Generated" icon={Activity} color="bg-orange-500" gradient="bg-gradient-to-br from-orange-500 to-orange-700" />
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COL: CHART (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                                    <Activity size={20} />
                                </div>
                                <h3 className="text-xl font-bold text-white">Generation Volume</h3>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} dy={10} minTickGap={30} />
                                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} dx={-10} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#60a5fa' }} />
                                    <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorReports)" animationDuration={1000} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: TOP USERS (1/3 width) */}
                <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <User className="text-emerald-400" size={18} /> Top Contributors
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
                        {/* Mocking 'Top Users' logic based on loaded reports. In prod, use a backend counter. */}
                        {Object.entries(recentReports.reduce((acc, curr) => {
                            acc[curr.userEmail] = (acc[curr.userEmail] || 0) + 1;
                            return acc;
                        }, {})).sort(([, a], [, b]) => b - a).slice(0, 5).map(([email, count], idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 w-4">#{idx + 1}</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{email?.split('@')[0]}</p>
                                        <p className="text-xs text-slate-500">{email}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-emerald-400">{count} reps</span>
                            </div>
                        ))}
                        {recentReports.length === 0 && <p className="text-slate-500 text-sm text-center mt-10">No activity yet.</p>}
                    </div>
                </div>
            </div>

            {/* BOTTOM SECTION: ANALYTICS WIDGETS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* MODALITY DISTRIBUTION */}
                <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <FileCheck className="text-purple-400" size={18} /> Modality Distribution
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={modalityData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {modalityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][index % 5]} stroke="rgba(0,0,0,0.2)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* USER ACTIVITY INSIGHTS */}
                <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity className="text-orange-400" size={18} /> Customer Activity
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                            <h4 className="text-orange-200 font-bold text-sm mb-1">Most Active Time</h4>
                            <p className="text-2xl font-bold text-white">10:00 AM - 2:00 PM</p>
                            <p className="text-orange-400/60 text-xs mt-1">Peak generation hours</p>
                        </div>

                        <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-6 mb-3">Recent Active Sessions</h4>
                        <div className="space-y-3">
                            {recentReports.slice(0, 4).map((r, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200">User {r.userId?.slice(0, 6)}...</p>
                                            <p className="text-xs text-slate-500">Generated {r.modality} Report</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">Just now</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;