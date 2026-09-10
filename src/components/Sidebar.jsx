import React from 'react';
import { LayoutDashboard, ShieldAlert, FileDown, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard KPIs', icon: LayoutDashboard },
    { id: 'blacklist', label: 'Threat Intelligence', icon: ShieldAlert },
    { id: 'logs', label: 'Exportación de Logs', icon: FileDown },
  ];

  return (
    <div className="w-64 h-screen bg-hm-card border-r border-hm-border p-4 flex flex-col">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded bg-hm-gold flex items-center justify-center text-black font-bold">HM</div>
        <h1 className="text-xl font-bold text-hm-gold">HoneyMetrics</h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
              currentView === item.id 
                ? 'bg-hm-gold/10 text-hm-gold border border-hm-gold/20' 
                : 'text-hm-muted hover:text-hm-text hover:bg-hm-bg'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-hm-border pt-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-hm-muted hover:text-hm-text hover:bg-hm-bg">
          <Settings size={20} />
          <span>Configuración</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-hm-danger hover:bg-hm-danger/10 transition-colors">
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
