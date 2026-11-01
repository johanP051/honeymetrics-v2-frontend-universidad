import React, { useState, useEffect } from 'react';
import { User, Edit3, Check, X, Shield, Calendar } from 'lucide-react';
import { updateMyProfileApi } from '../../api/usersApi';
import { useAuth } from '../../context/AuthContext';

export default function ProfileIdentityCard({ profile, onProfileUpdate }) {
  const { updateProfileData } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [firstNames, setFirstNames] = useState('');
  const [lastNames, setLastNames] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    if (profile) {
      setFirstNames(profile.first_names || '');
      setLastNames(profile.last_names || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const payload = {
        first_names: firstNames.trim(),
        last_names: lastNames.trim(),
        email: email.trim(),
      };
      const updated = await updateMyProfileApi(payload);
      if (updateProfileData) updateProfileData(updated);
      if (onProfileUpdate) onProfileUpdate();
      setStatusMessage({ type: 'success', text: 'Perfil actualizado exitosamente.' });
      setIsEditing(false);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Error al actualizar el perfil.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fullName = `${profile?.first_names || ''} ${profile?.last_names || ''}`.trim() || profile?.email || 'Usuario';

  return (
    <div className="bg-hm-card/90 border border-hm-border rounded-xl p-5 sm:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hm-border/60 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-hm-gold/15 border border-hm-gold/30 flex items-center justify-center text-hm-gold shrink-0">
            <User size={24} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-hm-text">{fullName}</h2>
            <p className="text-xs text-hm-muted">{profile?.email}</p>
          </div>
        </div>
        {!isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-hm-border text-xs font-semibold text-hm-text hover:text-hm-gold hover:border-hm-gold/40 transition-colors shrink-0"
          >
            <Edit3 size={14} aria-hidden="true" />
            <span>Editar Perfil</span>
          </button>
        ) : null}
      </div>

      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`mb-4 p-3 rounded-lg text-xs font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-hm-danger/10 border-hm-danger/30 text-hm-danger'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="profile-first-names" className="block text-xs font-semibold text-hm-muted mb-1">
                Nombres
              </label>
              <input
                id="profile-first-names"
                type="text"
                value={firstNames}
                onChange={(e) => setFirstNames(e.target.value)}
                className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-gold"
                required
                minLength={2}
              />
            </div>
            <div>
              <label htmlFor="profile-last-names" className="block text-xs font-semibold text-hm-muted mb-1">
                Apellidos
              </label>
              <input
                id="profile-last-names"
                type="text"
                value={lastNames}
                onChange={(e) => setLastNames(e.target.value)}
                className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-gold"
                required
                minLength={2}
              />
            </div>
          </div>
          <div>
            <label htmlFor="profile-email-input" className="block text-xs font-semibold text-hm-muted mb-1">
              Correo Electrónico
            </label>
            <input
              id="profile-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-hm-elevated border border-hm-border rounded-lg text-sm text-hm-text focus:outline-none focus:border-hm-gold"
              required
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hm-border text-xs text-hm-muted hover:text-hm-text transition-colors"
            >
              <X size={14} aria-hidden="true" />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-hm-gold text-slate-950 text-xs font-bold hover:bg-hm-goldHover transition-colors disabled:opacity-50"
            >
              <Check size={14} aria-hidden="true" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-hm-elevated/60 border border-hm-border/40">
            <span className="text-hm-muted flex items-center gap-1.5 mb-1 font-medium">
              <Shield size={14} className="text-hm-gold" aria-hidden="true" /> Rol Asignado
            </span>
            <span className="font-semibold text-hm-text">{profile?.role_name || 'Analista'}</span>
          </div>
          <div className="p-3 rounded-lg bg-hm-elevated/60 border border-hm-border/40">
            <span className="text-hm-muted block mb-1 font-medium">Estado de Cuenta</span>
            <span className={`font-semibold ${profile?.is_active ? 'text-emerald-400' : 'text-hm-danger'}`}>
              {profile?.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div className="p-3 rounded-lg bg-hm-elevated/60 border border-hm-border/40">
            <span className="text-hm-muted flex items-center gap-1.5 mb-1 font-medium">
              <Calendar size={14} className="text-hm-gold" aria-hidden="true" /> Fecha de Registro
            </span>
            <span className="font-semibold text-hm-text font-mono">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/D'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
