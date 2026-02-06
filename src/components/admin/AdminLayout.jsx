import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, BarChart2, LogOut, Shield, Megaphone, Activity, Menu, X } from 'lucide-react';
import { auth } from '../../firebase';
import { useState } from 'react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/auth');
  };

  const isActive = (path) => location.pathname === path;

  return (
    // ✨ BACKGROUND: Deep 'Obsidian' Hex with a subtle top-light
    <div className="flex h-screen bg-[#020617] text-gray-200 font-sans overflow-hidden relative selection:bg-indigo-500/30">

      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-900/10 blur-[120px] pointer-events-none" />

      {/* ✨ MOBILE HEADER (Visible only on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#0B1121]/90 backdrop-blur-md border-b border-white/5 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative p-1.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-lg shadow-lg border border-white/10">
            <Shield className="text-white" size={18} />
          </div>
          <span className="text-sm font-bold text-white tracking-tight">aiRAD<span className="text-indigo-400">.admin</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-300 hover:text-white p-1">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ✨ SIDEBAR: Glassy Noir (Responsive) */}
      <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-[#0B1121]/95 backdrop-blur-2xl border-r border-white/5 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:bg-[#0B1121]/80 md:backdrop-blur-xl
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Logo Area (Hidden on mobile inside sidebar to avoid duplication with header, or customized) */}
        <div className="p-8 flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative p-2.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-lg border border-white/10">
              <Shield className="text-white" size={24} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">aiRAD<span className="text-indigo-400">.admin</span></h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">System Control</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-2">
          <NavItem to="/admin" icon={BarChart2} label="Overview" active={isActive('/admin')} color="text-indigo-400" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/admin/users" icon={Users} label="User Directory" active={isActive('/admin/users')} color="text-cyan-400" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/admin/broadcasts" icon={Megaphone} label="Announcements" active={isActive('/admin/broadcasts')} color="text-rose-400" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>

        {/* User Profile / Logout */}
        <div className="p-4 m-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              AD
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Administrator</p>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-lg transition-all">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative z-10 scrollbar-thin scrollbar-thumb-indigo-900/50 scrollbar-track-transparent pt-16 md:pt-0">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// ✨ Nav Item with "Glow Bar" Active State
const NavItem = ({ to, icon: Icon, label, active, color, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`group relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium ${active
        ? 'bg-white/[0.03] text-white'
        : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.02]'
      }`}>
    {/* Active Indicator Line */}
    {active && <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]`} />}

    <Icon size={20} className={`transition-colors ${active ? color : 'text-gray-500 group-hover:text-gray-300'}`} />
    <span className="tracking-wide text-sm">{label}</span>
  </Link>
);

export default AdminLayout;