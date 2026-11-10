import React, { useState } from 'react';
import { ShieldCheck, Users, Shield, FileText, RefreshCw, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAdminSecurity } from '../../hooks/useAdminSecurity';
import UserManagementTab from '../../components/admin/UserManagementTab';
import RoleMatrixTab from '../../components/admin/RoleMatrixTab';
import AuditLogsTable from '../../components/admin/AuditLogsTable';

export default function AdminHub() {
  const [activeTab, setActiveTab] = useState('USERS'); // 'USERS' | 'ROLES' | 'AUDIT'
  const {
    users, roles, auditLogs, isLoading, toastMessage, clearToast,
    fetchAdminData, fetchAuditLogs,
    handleUserCreate, handleUserUpdate, handleUserDelete, handleUserMfaReset,
    handleRoleCreate, handleRoleDelete,
  } = useAdminSecurity();

  const handleRefreshAll = async () => {
    await Promise.all([fetchAdminData(), fetchAuditLogs()]);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
          {/* Toast flotante en esquina superior derecha sin bloquear botones */}
          {toastMessage && (
            <div
              role="status"
              aria-live="polite"
              className={`fixed top-16 sm:top-6 right-4 left-4 sm:left-auto sm:max-w-md z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-2xl border backdrop-blur-md animate-slide-up text-xs font-semibold ${
                toastMessage.type === 'error'
                  ? 'bg-hm-danger/20 border-hm-danger/50 text-hm-danger'
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {toastMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                <span>{toastMessage.message}</span>
              </div>
              <button
                type="button"
                onClick={clearToast}
                aria-label="Cerrar notificación"
                className="p-1 rounded hover:bg-white/10"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Encabezado Principal */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hm-border/70 pb-5">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-hm-gold flex items-center gap-2.5">
                <ShieldCheck size={28} aria-hidden="true" />
                Admin Hub & Gobernanza
              </h1>
              <p className="text-hm-muted mt-1 text-xs sm:text-sm">
                Administración integral de identidades, roles PBAC y auditoría del sistema (audit_logs).
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefreshAll}
              disabled={isLoading}
              className="flex items-center gap-2 px-3.5 py-2 bg-hm-elevated border border-hm-border rounded-lg text-xs font-semibold text-hm-muted hover:text-hm-gold hover:border-hm-gold/40 transition-all self-start sm:self-auto"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} aria-hidden="true" />
              <span>Actualizar Todo</span>
            </button>
          </div>

          {/* Navegación por Pestañas */}
          <div role="tablist" aria-label="Secciones de Administración" className="inline-flex flex-wrap items-center p-1.5 bg-hm-card/90 border border-hm-border rounded-xl gap-1.5 w-full sm:w-fit shadow-md">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'USERS'}
              onClick={() => setActiveTab('USERS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'USERS'
                  ? 'bg-hm-gold/15 text-hm-gold border border-hm-gold/30 shadow-sm'
                  : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60 border border-transparent'
              }`}
            >
              <Users size={15} aria-hidden="true" />
              <span>Usuarios</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'USERS' ? 'bg-hm-gold/20 text-hm-gold font-bold' : 'bg-hm-elevated text-hm-muted'}`}>
                {users.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ROLES'}
              onClick={() => setActiveTab('ROLES')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ROLES'
                  ? 'bg-hm-gold/15 text-hm-gold border border-hm-gold/30 shadow-sm'
                  : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60 border border-transparent'
              }`}
            >
              <Shield size={15} aria-hidden="true" />
              <span>Roles</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'ROLES' ? 'bg-hm-gold/20 text-hm-gold font-bold' : 'bg-hm-elevated text-hm-muted'}`}>
                {roles.length}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'AUDIT'}
              onClick={() => setActiveTab('AUDIT')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'AUDIT'
                  ? 'bg-hm-gold/15 text-hm-gold border border-hm-gold/30 shadow-sm'
                  : 'text-hm-muted hover:text-hm-text hover:bg-hm-elevated/60 border border-transparent'
              }`}
            >
              <FileText size={15} aria-hidden="true" />
              <span>Auditoría del Sistema</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono ${activeTab === 'AUDIT' ? 'bg-hm-gold/20 text-hm-gold font-bold' : 'bg-hm-elevated text-hm-muted'}`}>
                {auditLogs.length}
              </span>
            </button>
          </div>

          {/* Contenido Dinámico de la Pestaña Activa */}
          {activeTab === 'USERS' && (
            <UserManagementTab
              users={users}
              roles={roles}
              onUserCreate={handleUserCreate}
              onUserUpdate={handleUserUpdate}
              onUserDelete={handleUserDelete}
              onUserMfaReset={handleUserMfaReset}
              onRefresh={fetchAdminData}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'ROLES' && (
            <RoleMatrixTab
              roles={roles}
              onRoleCreate={handleRoleCreate}
              onRoleDelete={handleRoleDelete}
              isLoading={isLoading}
            />
          )}

          {activeTab === 'AUDIT' && (
            <AuditLogsTable
              auditLogs={auditLogs}
              onRefresh={fetchAuditLogs}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
  );
}
