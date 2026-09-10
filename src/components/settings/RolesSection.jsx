import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Shield, Plus, Users, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';

export default function RolesSection({ roles, onRoleCreate, onRoleDelete, isLoading }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    if (!roleName.trim()) {
      setModalError('El nombre del rol es obligatorio.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRoleCreate({
        name: roleName.trim(),
        description: roleDescription.trim() || undefined,
      });
      setRoleName('');
      setRoleDescription('');
      setIsModalOpen(false);
    } catch (err) {
      setModalError(err.response?.data?.detail || err.message || 'Error al crear el rol.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCanonical = (name) => {
    return ['administrador', 'analista', 'consultor', 'directivo'].includes(name?.toLowerCase());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-hm-text flex items-center gap-2">
            <Shield size={20} className="text-hm-gold" />
            Roles y Grupos de Permisos (PB-HM-13 a 16)
          </h3>
          <p className="text-xs text-hm-muted">Distribución de usuarios y asignación de privilegios en HoneyMetrics.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setModalError('');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-transparent border border-hm-gold text-hm-gold hover:bg-hm-gold/10 rounded-lg transition-colors text-xs font-bold"
        >
          <Plus size={16} />
          <span>Nuevo Rol</span>
        </button>
      </div>

      {/* Grid de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="glass-card p-5 border border-hm-border/70 hover:border-hm-gold/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="font-bold text-sm text-hm-text flex items-center gap-1.5">
                  <Shield size={16} className={isCanonical(role.name) ? 'text-hm-gold' : 'text-blue-400'} />
                  <span>{role.name}</span>
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-hm-gold/10 text-hm-gold border border-hm-gold/20">
                  <Users size={12} />
                  <span>{role.user_count}</span>
                </span>
              </div>
              <p className="text-xs text-hm-muted line-clamp-2 leading-relaxed">
                {role.description || 'Rol estándar del sistema.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-hm-border/40 flex items-center justify-between text-[11px]">
              <span className="text-hm-muted">
                {isCanonical(role.name) ? 'Rol Base (Protegido)' : 'Rol Corporativo'}
              </span>
              {!isCanonical(role.name) && (
                <button
                  type="button"
                  onClick={() => onRoleDelete(role.id, role.name)}
                  disabled={isLoading || role.user_count > 0}
                  title={role.user_count > 0 ? 'No se puede eliminar porque tiene usuarios asignados' : 'Eliminar rol'}
                  className="p-1 text-hm-muted hover:text-hm-danger disabled:opacity-30 disabled:hover:text-hm-muted transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nuevo Rol */}
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden p-4">
            <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative border border-hm-border shadow-2xl">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="absolute top-4 right-4 text-hm-muted hover:text-hm-danger transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="text-lg font-display font-bold text-hm-gold mb-2 flex items-center gap-2">
                <Plus size={20} />
                Crear Nuevo Rol (PB-HM-13)
              </h3>
              <p className="text-xs text-hm-muted mb-4">
                Define un nuevo grupo de usuarios con nombre único para categorizar accesos.
              </p>

              {modalError && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-hm-danger/10 border border-hm-danger/30 rounded-lg text-xs text-hm-danger">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Auditor Externo, Especialista DFIR"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
                    Descripción Funcional
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe los alcances o responsabilidades de este rol..."
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-lg text-sm text-hm-muted hover:bg-hm-elevated hover:text-hm-text transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-hm-gold text-hm-bg font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] text-sm disabled:opacity-50"
                  >
                    {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                    <span>Crear Rol</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
