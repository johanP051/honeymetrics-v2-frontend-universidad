import React, { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function MainLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-transparent flex-col relative overflow-hidden">
      {/* Skip Link para accesibilidad WCAG 2.2 AA (teclado / lectores de pantalla) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-hm-gold focus:text-hm-bg focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Saltar al contenido principal
      </a>

      {/* Barra superior móvil sticky visible SOLO en móvil */}
      <header className="md:hidden sticky top-0 z-30 bg-hm-card/95 backdrop-blur-md border-b border-hm-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label="Abrir menú"
            className="p-1.5 -ml-1 text-hm-muted hover:text-hm-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-gold rounded-lg"
          >
            <Menu size={22} aria-hidden="true" />
          </button>
          <img src="/images/logo.png" alt="HoneyMetrics Logo" className="w-7 h-7 object-contain" />
          <span className="font-display font-bold text-hm-gold text-base">HoneyMetrics</span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Salir de la sesión"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hm-danger/30 text-hm-danger hover:bg-hm-danger/10 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-hm-danger"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>Salir</span>
        </button>
      </header>

      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        isMobileOpen={isMobileDrawerOpen}
        onCloseMobile={() => setIsMobileDrawerOpen(false)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'ml-0 md:ml-20' : 'ml-0 md:ml-64'}`}>
        <main id="main-content" tabIndex="-1" className="flex-1 p-3 sm:p-6 md:p-8 animate-fade-up outline-none">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
