import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UserPlus, UserCheck, KeyRound, Copy, Check, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

export default function UserModal({ isOpen, onClose, userToEdit, roles, onSave, isLoading }) {
  const isEditing = Boolean(userToEdit);

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
  };

  useEffect(() => {
    if (userToEdit) {
      setEmail(userToEdit.email || '');
      setRoleId(userToEdit.role_id || (roles[0]?.id || ''));
      setPassword('');
      setIsActive(userToEdit.is_active ?? true);
      setSendEmail(false);
    } else {
      setEmail('');
      setRoleId(roles[1]?.id || roles[0]?.id || '');
      generateRandomPassword();
      setIsActive(true);
      setSendEmail(true);
    }
    setError('');
  }, [userToEdit, roles, isOpen]);

  if (!isOpen) return null;

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('El correo institucional es obligatorio.');
      return;
    }
    if (!roleId) {
      setError('Debes seleccionar un rol para el usuario.');
      return;
    }
    if (!isEditing && password.trim().length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const payload = isEditing
        ? { email: email.trim(), role_id: Number(roleId), is_active: isActive, new_password: password.trim() || undefined }
        : { email: email.trim(), role_id: Number(roleId), password: password.trim(), send_email: sendEmail };

      await onSave(payload, userToEdit?.id);
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Error al guardar usuario.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden p-4">
      <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative border border-hm-border shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-hm-muted hover:text-hm-danger transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-display font-bold text-hm-gold mb-2 flex items-center gap-2">
          {isEditing ? <UserCheck size={22} /> : <UserPlus size={22} />}
          {isEditing ? 'Modificar Usuario (PB-HM-19)' : 'Registrar Nuevo Usuario (PB-HM-17)'}
        </h2>
        <p className="text-xs text-hm-muted mb-5">
          {isEditing
            ? 'Actualiza el rol o estado de acceso de la cuenta en el sistema.'
            : 'Crea una cuenta para un miembro del equipo asignando un rol único y contraseña temporal.'}
        </p>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-hm-danger/10 border border-hm-danger/30 rounded-lg text-xs text-hm-danger">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
              Correo Institucional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre.apellido@ucundinamarca.edu.co"
              className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
              Rol Asignado (Único)
            </label>
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
              className="w-full bg-hm-bg border border-hm-border rounded-lg px-3 py-2 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id} className="bg-hm-card text-hm-text">
                  {r.name} — {r.description || 'Sin descripción'}
                </option>
              ))}
            </select>
          </div>

          {/* Contraseña */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider">
                {isEditing ? 'Restablecer Contraseña (Opcional)' : 'Contraseña Temporal'}
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-[11px] text-hm-gold hover:underline flex items-center gap-1"
              >
                <Sparkles size={12} />
                <span>Generar Segura</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required={!isEditing}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditing ? 'Dejar en blanco para mantener la actual' : 'Contraseña temporal'}
                  className="w-full bg-hm-bg border border-hm-border rounded-lg pl-9 pr-3 py-2 text-sm font-mono text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                />
                <KeyRound size={15} className="absolute left-3 top-2.5 text-hm-muted" />
              </div>
              {password && (
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  title="Copiar contraseña"
                  className="p-2 bg-hm-elevated border border-hm-border hover:border-hm-gold rounded-lg text-hm-muted hover:text-hm-gold transition-colors"
                >
                  {copied ? <Check size={16} className="text-hm-success" /> : <Copy size={16} />}
                </button>
              )}
            </div>
            {!isEditing && (
              <p className="text-[11px] text-hm-muted mt-1">
                El usuario deberá cambiar esta clave en su primer inicio de sesión.
              </p>
            )}
          </div>

          {/* Estado Activo (solo en edición) */}
          {isEditing && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-hm-bg border border-hm-border">
              <div>
                <span className="text-xs font-semibold text-hm-text block">Estado de la Cuenta</span>
                <span className="text-[11px] text-hm-muted">Permitir o suspender el acceso de este usuario</span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isActive ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Enviar correo con credenciales (solo al crear) */}
          {!isEditing && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="sendEmail"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="w-4 h-4 rounded border-hm-border text-hm-gold focus:ring-0 bg-hm-bg"
              />
              <label htmlFor="sendEmail" className="text-xs text-hm-text cursor-pointer flex items-center gap-1.5">
                <Send size={13} className="text-hm-gold" />
                <span>Despachar credenciales de bienvenida vía correo (Resend)</span>
              </label>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-hm-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm text-hm-muted hover:bg-hm-elevated hover:text-hm-text transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-hm-gold text-hm-bg font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] text-sm disabled:opacity-50"
            >
              {isLoading && <Loader2 size={16} className="animate-spin" />}
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Usuario'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
