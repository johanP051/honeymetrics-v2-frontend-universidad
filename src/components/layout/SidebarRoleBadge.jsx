import React from 'react';
import { Crown, Shield, BarChart3, Briefcase } from 'lucide-react';

const ROLE_META = {
  administrador: {
    label: 'Superusuario',
    icon: Crown,
    badgeClass: 'bg-hm-gold/15 text-hm-gold border-hm-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.12)]',
  },
  superusuario: {
    label: 'Superusuario',
    icon: Crown,
    badgeClass: 'bg-hm-gold/15 text-hm-gold border-hm-gold/30 shadow-[0_0_12px_rgba(212,175,55,0.12)]',
  },
  consultor: {
    label: 'Consultor CTI',
    icon: Shield,
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.12)]',
  },
  analista: {
    label: 'Analista SOC',
    icon: BarChart3,
    badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.12)]',
  },
  directivo: {
    label: 'Directivo T.I.',
    icon: Briefcase,
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.12)]',
  },
};

function resolveRoleConfig(roleName) {
  const norm = String(roleName || '').trim().toLowerCase();
  if (norm === 'administrador' || norm === 'superusuario' || norm === 'admin') return ROLE_META.administrador;
  if (norm.startsWith('consultor')) return ROLE_META.consultor;
  if (norm.startsWith('directivo')) return ROLE_META.directivo;
  return ROLE_META.analista;
}

export default function SidebarRoleBadge({ roleName, userEmail, isCollapsed = false }) {
  const config = resolveRoleConfig(roleName);
  const Icon = config.icon;

  if (isCollapsed) {
    return (
      <div className="px-3 pt-4 flex justify-center">
        <div
          title={`Rol activo: ${config.label}${userEmail ? ` (${userEmail})` : ''}`}
          aria-label={`Rol activo: ${config.label}`}
          className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${config.badgeClass}`}
        >
          <Icon size={18} aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      <div className={`px-3 py-2.5 rounded-lg border flex items-center gap-2.5 transition-all ${config.badgeClass}`}>
        <Icon size={17} aria-hidden="true" className="flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold tracking-wide uppercase truncate">{config.label}</div>
          {userEmail && (
            <div className="text-[11px] opacity-75 font-mono truncate" title={userEmail}>
              {userEmail}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
