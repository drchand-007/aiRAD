// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, BarChart2, FileText, LogOut, Shield } from 'lucide-react';
import { auth } from '../../firebase'; // Adjust path to your firebase.js

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <Shield className="text-blue-500" />
            <h1 className="text-xl font-bold">aiRAD Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                <BarChart2 size={20} /> Dashboard
            </Link>
            <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                <Users size={20} /> User Management
            </Link>
             <Link to="/admin/content" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/content') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                <FileText size={20} /> Findings & Macros
            </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 w-full rounded-lg transition-colors">
                <LogOut size={20} /> Logout
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;