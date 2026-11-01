import React, { useState } from 'react';
import { ShieldCheck, Users, Shield, FileText, RefreshCw, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
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
    <>
      <Navbar />

      <main id="main-content" tabIndex="-1" className="p-3 sm:p-6 md:p-8 animate-fade-up outline-none min-h-screen">
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
          <div role="tablist" aria-label="Secciones de Administración" className="flex flex-wrap items-center p-1 bg-hm-elevated/80 border border-hm-border rounded-xl gap-1 w-full sm:w-auto">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'USERS'}
              onClick={() => setActiveTab('USERS')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'USERS' ? 'bg-hm-gold text-slate-950 font-bold shadow-md' : 'text-hm-muted hover:text-hm-text'
              }`}
            >
              <Users size={15} aria-hidden="true" />
              <span>Usuarios ({users.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'ROLES'}
              onClick={() => setActiveTab('ROLES')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'ROLES' ? 'bg-hm-gold text-slate-950 font-bold shadow-md' : 'text-hm-muted hover:text-hm-text'
              }`}
            >
              <Shield size={15} aria-hidden="true" />
              <span>Roles ({roles.length})</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'AUDIT'}
              onClick={() => setActiveTab('AUDIT')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'AUDIT' ? 'bg-hm-gold text-slate-950 font-bold shadow-md' : 'text-hm-muted hover:text-hm-text'
              }`}
            >
              <FileText size={15} aria-hidden="true" />
              <span>Auditoría del Sistema ({auditLogs.length})</span>
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
      </main>
      <Footer />
    </>
  );
}
