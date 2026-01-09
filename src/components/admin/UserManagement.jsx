// src/components/admin/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { toast } from 'react-hot-toast';
import { Search, Shield, ShieldOff } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    // Toggle Role Function
    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'pro' ? 'basic' : 'pro';
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { role: newRole });
            
            // Update local state to reflect change instantly
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            toast.success(`User role updated to ${newRole.toUpperCase()}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role");
        }
    };

    const filteredUsers = users.filter(u => 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by email..." 
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                        <tr>
                            <th className="p-4">User Email</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                             <tr><td colSpan="4" className="p-8 text-center text-gray-500">Loading users...</td></tr>
                        ) : filteredUsers.map(user => (
                            <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                                <td className="p-4 font-medium text-slate-800">{user.email || 'No Email'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'pro' ? 'bg-green-100 text-green-700' : 
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {user.role?.toUpperCase() || 'BASIC'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-500 text-sm">Active</td>
                                <td className="p-4 text-right">
                                    {user.role !== 'admin' && (
                                        <button 
                                            onClick={() => toggleRole(user.id, user.role)}
                                            className={`text-sm font-semibold px-3 py-1 rounded-md transition-colors ${
                                                user.role === 'pro' 
                                                ? 'text-red-600 hover:bg-red-50' 
                                                : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                        >
                                            {user.role === 'pro' ? 'Downgrade to Basic' : 'Upgrade to Pro'}
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