import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Threat Center', path: '/threat-center', icon: ShieldAlert },
    { name: 'Logs & Reportes', path: '/logs', icon: FileText },
    { name: 'Configuración', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`fixed top-0 left-0 h-screen glass-card rounded-none border-t-0 border-l-0 border-b-0 flex flex-col z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Toggle Button */}
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-8 bg-hm-card border border-hm-border rounded-full p-1 text-hm-muted hover:text-hm-gold hover:border-hm-gold transition-colors shadow-lg z-30"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <div className={`p-6 border-b border-hm-border flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
        <img src="/images/logo.png" alt="Logo" className="w-8 h-8 object-contain flex-shrink-0 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
        {!isCollapsed && (
          <h1 className="text-xl font-display font-bold text-hm-gold m-0 whitespace-nowrap overflow-hidden">HoneyMetrics</h1>
        )}
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-hm-gold/10 text-hm-gold border border-hm-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                  : 'text-hm-muted hover:bg-hm-elevated hover:text-hm-text'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-hm-border">
        <button 
          onClick={handleLogout}
          title={isCollapsed ? "Cerrar Sesión" : undefined}
          className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-hm-danger hover:bg-hm-danger/10 hover:shadow-[0_0_15px_rgba(208,107,98,0.15)] transition-all duration-300 ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!isCollapsed && <span className="font-medium whitespace-nowrap">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}
