import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import { Search, Shield, User, Filter, MoreHorizontal } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'pro' ? 'basic' : 'pro';
        try {
            await updateDoc(doc(db, 'users', userId), { role: newRole });
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`Role updated to ${newRole.toUpperCase()}`);
        } catch (error) { toast.error("Update failed"); }
    };

    const filteredUsers = users.filter(u => u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Directory</h2>
                    <p className="text-gray-400 mt-1 text-sm">Manage user access and subscriptions.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search emails..." 
                        className="w-80 pl-10 pr-4 py-2.5 bg-[#0f1629] border border-gray-700 rounded-xl text-white text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all shadow-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-[#0f1629] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-gray-900/50 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-5 pl-6">Identity</th>
                            <th className="p-5">Subscription Tier</th>
                            <th className="p-5">Account Status</th>
                            <th className="p-5 text-right pr-6">Controls</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                             <tr><td colSpan="4" className="p-10 text-center text-gray-500">Loading...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-5 pl-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 group-hover:border-gray-500 transition-colors">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-200">{user.email?.split('@')[0]}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                        user.role === 'pro' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
                                        'bg-gray-800 text-gray-400 border-gray-700'
                                    }`}>
                                        {user.role === 'admin' && <Shield size={10} />}
                                        {user.role?.toUpperCase() || 'BASIC'}
                                    </span>
                                </td>
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        <span className="text-sm text-gray-300 font-medium">Active</span>
                                    </div>
                                </td>
                                <td className="p-5 text-right pr-6">
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => toggleRole(user.id, user.role)}
                                            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all border ${
                                                user.role === 'pro' 
                                                ? 'bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10' 
                                                : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                            }`}
                                        >
                                            {user.role === 'pro' ? 'Downgrade' : 'Upgrade to Pro'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;