import React, { useState, useRef, useEffect } from 'react';

import { Shield, Plus, Trash2, Check, X } from 'lucide-react';

export default function RoleMatrixTab({ roles = [], onRoleCreate, onRoleDelete, isLoading }) {
  const [isCreating, setIsCreating] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [description, setDescription] = useState('');
  const [errorLocal, setErrorLocal] = useState('');
  const roleInputRef = useRef(null);

  useEffect(() => {
    if (isCreating) {
      roleInputRef.current?.focus();
    }
  }, [isCreating]);

  const handleCreate = async (e) => {

    e.preventDefault();
    setErrorLocal('');
    if (!roleName.trim()) {
      setErrorLocal('El nombre del rol es obligatorio.');
      return;
    }
    try {
      await onRoleCreate({
        name: roleName.trim(),
        description: description.trim() || undefined,
      });
      setRoleName('');
      setDescription('');
      setIsCreating(false);
    } catch (err) {
      setErrorLocal(err.response?.data?.detail || 'Error al crear el rol.');
    }
  };

  return (
    <div className="bg-hm-card/90 border border-hm-border rounded-xl p-5 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hm-border/60 pb-4">
        <div>
          <h2 className="text-base font-bold text-hm-gold flex items-center gap-2">
            <Shield size={18} aria-hidden="true" />
            Roles y Matriz de Permisos (PBAC)
          </h2>
          <p className="text-xs text-hm-muted">
            Definición de roles institucionales y privilegios de acceso del sistema.
          </p>
        </div>
        {!isCreating && (
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors shrink-0"
          >
            <Plus size={14} aria-hidden="true" />
            <span>+ Nuevo Rol</span>
          </button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="p-4 bg-hm-elevated border border-hm-border rounded-xl space-y-3 text-xs">
          <h3 className="font-bold text-hm-gold text-xs">Registrar Nuevo Rol</h3>
          {errorLocal && <div role="alert" className="p-2 rounded bg-hm-danger/10 border border-hm-danger/30 text-hm-danger">{errorLocal}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="new-role-name" className="block text-hm-muted font-semibold mb-1">Nombre del Rol</label>
              <input id="new-role-name" ref={roleInputRef} type="text" value={roleName} onChange={(e) => setRoleName(e.target.value)} placeholder="Ej: Auditor" className="w-full px-3 py-1.5 bg-hm-card border border-hm-border rounded-lg text-hm-text focus:outline-none focus:border-hm-gold" required />

            </div>
            <div>
              <label htmlFor="new-role-desc" className="block text-hm-muted font-semibold mb-1">Descripción</label>
              <input id="new-role-desc" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción de permisos" className="w-full px-3 py-1.5 bg-hm-card border border-hm-border rounded-lg text-hm-text focus:outline-none focus:border-hm-gold" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIsCreating(false)} className="flex items-center gap-1 px-3 py-1 rounded border border-hm-border text-hm-muted hover:text-hm-text">
              <X size={13} /> Cancelar
            </button>
            <button type="submit" disabled={isLoading || !roleName.trim()} className="flex items-center gap-1 px-3.5 py-1 rounded bg-hm-gold text-slate-950 font-bold hover:bg-hm-goldHover disabled:opacity-50">
              <Check size={13} /> Guardar Rol
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-hm-border/60">
        <table className="w-full text-left text-xs min-w-[640px]">
          <thead className="bg-hm-elevated/80 text-hm-muted uppercase tracking-wider font-semibold border-b border-hm-border">
            <tr>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Nombre del Rol</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap">Descripción</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap text-center">Usuarios Asignados</th>
              <th scope="col" className="px-3.5 py-3 whitespace-nowrap text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hm-border/40 font-mono">
            {roles.map((role) => {
              const isAdminRole = (role.name || '').toLowerCase() === 'administrador';
              const canDelete = !isAdminRole && (role.user_count === 0 || !role.user_count);
              return (
                <tr key={role.id} className="hover:bg-hm-elevated/40 transition-colors">
                  <td className="px-3.5 py-3 font-sans font-bold text-hm-text whitespace-nowrap">{role.name}</td>
                  <td className="px-3.5 py-3 font-sans text-hm-muted truncate max-w-xs">{role.description || '-'}</td>
                  <td className="px-3.5 py-3 text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold bg-hm-elevated border border-hm-border text-hm-gold">
                      {role.user_count ?? 0}
                    </span>
                  </td>
                  <td className="px-3.5 py-3 text-right whitespace-nowrap">
                    {canDelete ? (
                      <button type="button" onClick={() => onRoleDelete(role.id)} disabled={isLoading} className="p-1.5 text-hm-danger hover:bg-hm-danger/10 rounded transition-colors" title="Eliminar Rol">
                        <Trash2 size={15} />
                      </button>
                    ) : (
                      <span className="text-[11px] font-sans text-hm-muted/60">{isAdminRole ? 'Protegido' : 'En uso'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
