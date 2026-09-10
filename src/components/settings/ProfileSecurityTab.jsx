import React, { useState } from 'react';
import { User, Shield, KeyRound, ShieldAlert, ShieldCheck, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { changePasswordApi, setupMfaApi, verifyMfaApi, disableMfaApi } from '../../api/usersApi';
import MfaModal from './MfaModal';

export default function ProfileSecurityTab({ profile, onProfileUpdate }) {
  // Estados para cambio de contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Estados para 2FA
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [mfaData, setMfaData] = useState({ secret: '', qr_code_base64: '' });
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [mfaMessage, setMfaMessage] = useState('');

  // Cálculo de fortaleza de contraseña
  const calculateStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-transparent' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) return { score: 33, label: 'Débil', color: 'bg-hm-danger' };
    if (score <= 3) return { score: 66, label: 'Media', color: 'bg-yellow-500' };
    return { score: 100, label: 'Fuerte', color: 'bg-hm-success' };
  };

  const strength = calculateStrength(newPassword);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 8) {
      setPasswordError('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setPasswordSuccess('Contraseña actualizada exitosamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Error al actualizar la contraseña. Verifica tu clave actual.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleOpenMfaSetup = async () => {
    setIsMfaLoading(true);
    setMfaMessage('');
    try {
      const data = await setupMfaApi();
      setMfaData(data);
      setIsMfaModalOpen(true);
    } catch (err) {
      setMfaMessage('No se pudo iniciar la vinculación MFA.');
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleVerifyMfa = async (code) => {
    setIsMfaLoading(true);
    try {
      await verifyMfaApi(code);
      setMfaMessage('Autenticación 2FA activada con éxito.');
      if (onProfileUpdate) onProfileUpdate();
      return true;
    } catch (err) {
      alert(err.response?.data?.detail || 'Código de 6 dígitos inválido.');
      return false;
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!window.confirm('¿Estás seguro de desactivar la autenticación de dos factores? Tu cuenta será menos segura.')) return;
    setIsMfaLoading(true);
    try {
      await disableMfaApi();
      setMfaMessage('2FA desactivado.');
      if (onProfileUpdate) onProfileUpdate();
    } catch (err) {
      alert('Error al desactivar 2FA.');
    } finally {
      setIsMfaLoading(false);
    }
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName?.toLowerCase()) {
      case 'administrador':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'analista':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'consultor':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'directivo':
        return 'bg-hm-gold/20 text-hm-gold border-hm-gold/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Tarjeta de Identidad y Rol */}
      <div className="glass-card p-6 border-t-4 border-t-hm-gold">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-hm-gold/10 border border-hm-gold/30 flex items-center justify-center text-hm-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-hm-text flex items-center gap-2">
                {profile?.email}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getRoleBadgeColor(profile?.role_name)}`}>
                  {profile?.role_name || 'Cargando...'}
                </span>
                <span className="text-xs text-hm-muted">
                  &bull; Miembro desde: {profile?.created_at || 'Registrado'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Cuenta Activa
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Formulario de Cambio de Contraseña (PB-HM-05) */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-hm-gold/10 text-hm-gold border border-hm-gold/20">
              <KeyRound size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-hm-text">Cambio de Contraseña</h3>
              <p className="text-xs text-hm-muted">Actualiza tu clave periódicamente para mantener tu cuenta protegida.</p>
            </div>
          </div>

          {passwordSuccess && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-400">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-hm-danger/10 border border-hm-danger/30 rounded-lg text-xs text-hm-danger">
              <AlertCircle size={16} className="shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                  className="w-full bg-hm-bg border border-hm-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-hm-muted" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full bg-hm-bg border border-hm-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                />
                <KeyRound size={16} className="absolute left-3.5 top-3 text-hm-muted" />
              </div>

              {/* Barra de fortaleza */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex justify-between items-center text-[11px] text-hm-muted mb-1">
                    <span>Seguridad:</span>
                    <span className="font-semibold text-hm-text">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-hm-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${strength.score}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-hm-muted uppercase tracking-wider mb-1">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full bg-hm-bg border border-hm-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-hm-text focus:outline-none focus:border-hm-gold transition-colors"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-hm-muted" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-hm-gold text-hm-bg font-bold rounded-lg hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)] text-sm disabled:opacity-50"
            >
              {isChangingPassword && <Loader2 size={16} className="animate-spin" />}
              <span>{isChangingPassword ? 'Actualizando...' : 'Actualizar Contraseña'}</span>
            </button>
          </form>
        </div>

        {/* 3. Segundo Factor de Autenticación 2FA / TOTP (PB-HM-07) */}
        <div className="glass-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-hm-text">Autenticación en Dos Pasos (2FA)</h3>
                <p className="text-xs text-hm-muted">Protege tu cuenta agregando una capa de verificación mediante TOTP.</p>
              </div>
            </div>

            {mfaMessage && (
              <div className="mb-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg text-xs text-purple-300">
                {mfaMessage}
              </div>
            )}

            <div className="p-4 rounded-xl bg-hm-bg border border-hm-border mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-hm-muted uppercase">Estado Actual:</span>
                {profile?.is_mfa_enabled ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck size={14} />
                    Habilitado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                    <ShieldAlert size={14} />
                    Desactivado
                  </span>
                )}
              </div>
              <p className="text-xs text-hm-muted leading-relaxed">
                Al activar 2FA, HoneyMetrics te solicitará un código dinámico de 6 dígitos emitido por Google Authenticator cada vez que inicies sesión.
              </p>
            </div>
          </div>

          <div>
            {profile?.is_mfa_enabled ? (
              <button
                type="button"
                onClick={handleDisableMfa}
                disabled={isMfaLoading}
                className="w-full py-2.5 px-4 rounded-lg border border-hm-danger/40 text-hm-danger hover:bg-hm-danger/10 transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              >
                {isMfaLoading && <Loader2 size={16} className="animate-spin" />}
                <span>Desactivar 2FA</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleOpenMfaSetup}
                disabled={isMfaLoading}
                className="w-full py-2.5 px-4 rounded-lg bg-transparent border-2 border-hm-gold text-hm-gold hover:bg-hm-gold hover:text-hm-bg transition-all font-bold text-sm shadow-[0_0_15px_rgba(212,175,55,0.15)] flex items-center justify-center gap-2"
              >
                {isMfaLoading && <Loader2 size={16} className="animate-spin" />}
                <span>Configurar Google Authenticator (QR)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <MfaModal
        isOpen={isMfaModalOpen}
        onClose={() => setIsMfaModalOpen(false)}
        qrCode={mfaData.qr_code_base64}
        secret={mfaData.secret}
        onVerify={handleVerifyMfa}
        isLoading={isMfaLoading}
      />
    </div>
  );
}
