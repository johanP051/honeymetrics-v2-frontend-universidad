import React, { useState, useEffect } from 'react';
import { X, UserPlus, RefreshCw, Edit2 } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';

const generateTempPassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  const array = new Uint32Array(14);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
  }
  let pwd = '';
  for (let i = 0; i < 14; i++) {
    pwd += chars.charAt(array[i] % chars.length);
  }
  return pwd;
};

export default function UserModal({
  isOpen, onClose, triggerRef, onSubmit, roles = [], isLoading, userToEdit = null
}) {
  const isEditing = Boolean(userToEdit);
  const [firstNames, setFirstNames] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [errorLocal, setErrorLocal] = useState('');

  const modalRef = useModalA11y({ isOpen, onClose, triggerRef, isLoading });

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setFirstNames(userToEdit.first_names || '');
        setLastNames(userToEdit.last_names || '');
        setEmail(userToEdit.email || '');
        setRoleId(userToEdit.role_id ? String(userToEdit.role_id) : roles[0]?.id ? String(roles[0].id) : '1');
        setTempPassword('');
        setSendEmail(false);
      } else {
        setFirstNames('');
        setLastNames('');
        setEmail('');
        setRoleId(roles[0]?.id ? String(roles[0].id) : '1');
        setTempPassword(generateTempPassword());
        setSendEmail(true);
      }
      setErrorLocal('');
    }
  }, [isOpen, userToEdit, roles]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorLocal('');
    if (!firstNames.trim() || !lastNames.trim() || !email.trim()) {
      setErrorLocal('Nombres, apellidos y correo son obligatorios.');
      return;
    }
    if (!isEditing && !tempPassword.trim()) {
      setErrorLocal('La contraseña temporal es obligatoria.');
      return;
    }
    try {
      const payload = {
        first_names: firstNames.trim(),
        last_names: lastNames.trim(),
        email: email.trim(),
        role_id: parseInt(roleId, 10),
        ...(tempPassword.trim() ? { [isEditing ? 'new_password' : 'temp_password']: tempPassword.trim() } : {}),
        ...(!isEditing ? { send_email: sendEmail } : {}),
      };
      await onSubmit(payload, userToEdit?.id);
      onClose();
    } catch (err) {
      setErrorLocal(err.response?.data?.detail || 'Error al guardar usuario.');
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="user-modal-title" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div ref={modalRef} className="w-full max-w-lg bg-hm-card border border-hm-border rounded-xl shadow-2xl p-5 sm:p-6 text-hm-text">
        <div className="flex items-center justify-between border-b border-hm-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            {isEditing ? <Edit2 size={20} className="text-hm-gold" aria-hidden="true" /> : <UserPlus size={20} className="text-hm-gold" aria-hidden="true" />}
            <h2 id="user-modal-title" className="text-base font-bold text-hm-text">
              {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
          </div>
          <button type="button" onClick={onClose} disabled={isLoading} aria-label="Cerrar diálogo" className="p-1 rounded-lg text-hm-muted hover:text-hm-text">
            <X size={18} />
          </button>
        </div>

        {errorLocal && (
          <div role="alert" className="mb-4 p-2.5 rounded-lg bg-hm-danger/10 border border-hm-danger/30 text-hm-danger text-xs">
            {errorLocal}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="user-first-names" className="block font-semibold text-hm-muted mb-1">Nombres</label>
              <input id="user-first-names" type="text" value={firstNames} onChange={(e) => setFirstNames(e.target.value)} className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-hm-text text-xs focus:outline-none focus:border-hm-gold" required autoFocus />
            </div>
            <div>
              <label htmlFor="user-last-names" className="block font-semibold text-hm-muted mb-1">Apellidos</label>
              <input id="user-last-names" type="text" value={lastNames} onChange={(e) => setLastNames(e.target.value)} className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-hm-text text-xs focus:outline-none focus:border-hm-gold" required />
            </div>
          </div>

          <div>
            <label htmlFor="user-email" className="block font-semibold text-hm-muted mb-1">Correo Electrónico</label>
            <input id="user-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-hm-text text-xs focus:outline-none focus:border-hm-gold" required />
          </div>

          <div>
            <label htmlFor="user-role-select" className="block font-semibold text-hm-muted mb-1">Rol en el Sistema</label>
            <select id="user-role-select" value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-hm-text text-xs focus:outline-none focus:border-hm-gold">
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="user-temp-pwd" className="block font-semibold text-hm-muted mb-1">
              {isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña Temporal'}
            </label>
            <div className="flex gap-2">
              <input
                id="user-temp-pwd"
                type="text"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder={isEditing ? 'Dejar en blanco para mantener la actual' : ''}
                className="w-full font-mono px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-hm-text text-xs focus:outline-none focus:border-hm-gold"
                required={!isEditing}
              />
              <button type="button" onClick={() => setTempPassword(generateTempPassword())} className="p-2 border border-hm-border rounded-lg hover:text-hm-gold text-hm-muted" title="Generar clave aleatoria">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {!isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input id="user-send-email" type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} className="rounded border-hm-border text-hm-gold focus:ring-0" />
              <label htmlFor="user-send-email" className="text-hm-muted">Enviar credenciales temporales por correo electrónico</label>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-hm-border/60">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-3.5 py-1.5 rounded-lg border border-hm-border text-hm-muted hover:text-hm-text">Cancelar</button>
            <button type="submit" disabled={isLoading} className="px-4 py-1.5 rounded-lg bg-hm-gold text-slate-950 font-bold hover:bg-hm-goldHover disabled:opacity-50">
              {isLoading ? (isEditing ? 'Guardando...' : 'Registrando...') : (isEditing ? 'Guardar Cambios' : 'Registrar Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
