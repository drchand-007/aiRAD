// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { collection, getCountFromServer, query, where, collectionGroup, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, FileCheck, DollarSign, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, subDays } from 'date-fns';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
        <div className={`p-4 rounded-full ${color} text-white`}>
            <Icon size={24} />
        </div>
        <div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, proUsers: 0, reports: 0 });
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Basic Counts
                const usersColl = collection(db, 'users');
                const userSnapshot = await getCountFromServer(usersColl);
                const proQuery = query(usersColl, where("role", "==", "pro"));
                const proSnapshot = await getCountFromServer(proQuery);
                const reportsQuery = query(collectionGroup(db, 'reports'));
                const reportSnapshot = await getCountFromServer(reportsQuery);

                setStats({
                    users: userSnapshot.data().count,
                    proUsers: proSnapshot.data().count,
                    reports: reportSnapshot.data().count
                });

                // 2. Chart Data: Reports from last 30 days
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const recentReportsQuery = query(
                    collectionGroup(db, 'reports'),
                    where('createdAt', '>=', thirtyDaysAgo),
                    orderBy('createdAt', 'asc')
                );

                const querySnapshot = await getDocs(recentReportsQuery);
                
                // Aggregate reports by date
                const reportsByDate = {};
                // Initialize last 30 days with 0
                for (let i = 0; i < 30; i++) {
                    const d = subDays(new Date(), i);
                    const dateStr = format(d, 'MMM dd');
                    reportsByDate[dateStr] = 0;
                }

                querySnapshot.forEach(doc => {
                    const data = doc.data();
                    if (data.createdAt) {
                        const dateStr = format(data.createdAt.toDate(), 'MMM dd');
                        if (reportsByDate[dateStr] !== undefined) {
                            reportsByDate[dateStr] += 1;
                        }
                    }
                });

                // Convert to array for Recharts and sort by date
                const chartDataArray = Object.keys(reportsByDate).map(date => ({
                    name: date,
                    reports: reportsByDate[date]
                })).reverse(); // Recharts renders left-to-right, so we want oldest first

                setChartData(chartDataArray);

            } catch (err) {
                console.error("Error loading dashboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading Analytics...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, Admin.</p>
            </div>
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-blue-500" />
                <StatCard title="Pro Subscribers" value={stats.proUsers} icon={DollarSign} color="bg-green-500" />
                <StatCard title="Total Reports Generated" value={stats.reports} icon={FileCheck} color="bg-purple-500" />
            </div>

            {/* Analytics Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 mb-6">
                    <Activity className="text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-800">Report Activity (Last 30 Days)</h3>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="reports" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReports)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;