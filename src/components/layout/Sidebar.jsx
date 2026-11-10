import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShieldAlert, FileText, Settings, ShieldCheck, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SidebarRoleBadge from './SidebarRoleBadge';

export default function Sidebar({ isCollapsed, toggleCollapse, isMobileOpen, onCloseMobile }) {
  const { logout, hasScope, role, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const effectiveRole = role || user?.role_name || user?.role || (typeof localStorage !== 'undefined' ? localStorage.getItem('hm_role') : null);
  const isAdmin = Boolean(
    effectiveRole && (effectiveRole.toLowerCase() === 'administrador' || effectiveRole.toLowerCase() === 'superusuario')
  );

  const navItems = [
    ...((isAdmin || hasScope('dashboard:read')) ? [{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard }] : []),
    ...((isAdmin || hasScope('threats:read')) ? [{ name: 'Threat Center', path: '/threat-center', icon: ShieldAlert }] : []),
    ...((isAdmin || hasScope('logs:read')) ? [{ name: 'Logs & Reportes', path: '/logs', icon: FileText }] : []),
    ...((isAdmin || hasScope('admin:all')) ? [{ name: 'Admin Hub', path: '/admin', icon: ShieldCheck }] : []),
    { name: 'Configuración', path: '/settings', icon: Settings },
  ];

  const isItemActive = (itemPath) => {
    if (itemPath === '/threat-center') {
      return location.pathname === '/threat-center' || location.pathname === '/blacklist';
    }
    return location.pathname === itemPath;
  };

  const handleLogout = () => {
    logout();
    void navigate('/login');
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      <aside className={`hidden md:flex fixed top-0 left-0 h-screen glass-card rounded-none border-t-0 border-l-0 border-b-0 flex-col z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <button
          type="button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
          className="absolute -right-3 top-8 bg-hm-card border border-hm-border rounded-full p-1 text-hm-muted hover:text-hm-gold hover:border-hm-gold transition-colors shadow-lg z-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold"
        >
          {isCollapsed ? <ChevronRight size={16} aria-hidden="true" /> : <ChevronLeft size={16} aria-hidden="true" />}
        </button>

        <div className={`p-6 border-b border-hm-border flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
          <img src="/images/logo.png" alt="HoneyMetrics Logo" className="w-8 h-8 object-contain flex-shrink-0 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
          {!isCollapsed && (
            <span className="text-xl font-display font-bold text-hm-gold m-0 whitespace-nowrap overflow-hidden">HoneyMetrics</span>
          )}
        </div>

        <SidebarRoleBadge roleName={effectiveRole} userEmail={user?.email} isCollapsed={isCollapsed} />

        <nav aria-label="Navegación Principal" className="flex-1 py-6 px-4 space-y-2 overflow-x-hidden">
          {navItems.map((item) => {
            const active = isItemActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                aria-label={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold ${
                  active
                    ? 'bg-hm-gold/10 text-hm-gold border border-hm-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                    : 'text-hm-muted hover:bg-hm-elevated hover:text-hm-text border border-transparent'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <item.icon size={20} aria-hidden="true" className="flex-shrink-0" />
                {!isCollapsed && <span className="font-medium whitespace-nowrap">{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-hm-border">
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
            aria-label="Cerrar Sesión"
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg text-hm-danger hover:bg-hm-danger/10 hover:shadow-[0_0_15px_rgba(208,107,98,0.15)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-danger ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} aria-hidden="true" className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Menú Móvil"
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-hm-card border-r border-hm-border shadow-2xl flex flex-col md:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 border-b border-hm-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="HoneyMetrics Logo" className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
            <span className="text-xl font-display font-bold text-hm-gold">HoneyMetrics</span>
          </div>
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
            className="p-1.5 rounded-lg text-hm-muted hover:text-hm-gold hover:bg-hm-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegación Móvil" className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isItemActive(item.path);
            return (
              <NavLink
                key={`mobile-${item.path}`}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold ${
                  active
                    ? 'bg-hm-gold/15 text-hm-gold font-semibold border border-hm-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'text-hm-muted hover:bg-hm-elevated hover:text-hm-text border border-transparent'
                }`}
              >
                <item.icon size={20} aria-hidden="true" className="flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-hm-border bg-hm-bg/40">
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Cerrar Sesión"
            className="flex items-center justify-center gap-2.5 px-4 py-2.5 w-full rounded-lg border border-hm-danger/30 text-hm-danger hover:bg-hm-danger/10 transition-colors text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-danger"
          >
            <LogOut size={18} aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
