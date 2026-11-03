import React, { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon, ShieldCheck, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyProfileApi } from '../api/usersApi';
import useProfileSecurity from '../hooks/useProfileSecurity';
import ProfileIdentityCard from '../components/settings/ProfileIdentityCard';
import PasswordChangeCard from '../components/settings/PasswordChangeCard';
import MfaSecurityCard from '../components/settings/MfaSecurityCard';
import MfaModal from '../components/settings/MfaModal';
import DisableMfaModal from '../components/settings/DisableMfaModal';

export default function Settings() {
  const { user: authUser, updateProfileData } = useAuth();
  const authUserRef = React.useRef(authUser);
  authUserRef.current = authUser;

  const [profile, setProfile] = useState(authUser || null);
  const [toastMessage, setToastMessage] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getMyProfileApi();
      setProfile(data);
      if (updateProfileData) updateProfileData(data);
    } catch {
      // Si falla llamada de red, mantener el perfil de la sesión
      if (authUserRef.current) setProfile(authUserRef.current);
    }
  }, [updateProfileData]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const sec = useProfileSecurity({ onProfileUpdate: fetchProfile });

  const handleMfaModalClose = (wasActivated) => {
    sec.setIsMfaModalOpen(false);
    if (wasActivated) {
      setToastMessage({ type: 'success', text: 'Autenticación en dos pasos activada exitosamente.' });
      fetchProfile();
    }
  };

  return (
    <div className="space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Toast flotante en esquina superior derecha */}
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
                <span>{toastMessage.text}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                aria-label="Cerrar notificación"
                className="p-1 rounded hover:bg-white/10"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {/* Encabezado */}
          <div className="border-b border-hm-border/70 pb-5">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-hm-gold flex items-center gap-2.5">
              <SettingsIcon size={28} aria-hidden="true" />
              Configuración de Perfil & Seguridad
            </h1>
            <p className="text-hm-muted mt-1 text-xs sm:text-sm">
              Gestione su información personal, credenciales de acceso y segundo factor 2FA.
            </p>
          </div>

          {/* Tarjeta de Identidad y Edición de Perfil */}
          <ProfileIdentityCard
            profile={profile}
            onProfileUpdate={fetchProfile}
          />

          {/* Tarjeta de Autenticación 2FA */}
          <MfaSecurityCard
            isMfaEnabled={Boolean(profile?.is_mfa_enabled)}
            onOpenSetup={sec.handleOpenMfaSetup}
            onOpenDisable={sec.handleOpenDisableMfa}
            mfaTriggerRef={sec.mfaTriggerRef}
            disableMfaTriggerRef={sec.disableMfaTriggerRef}
            isLoading={sec.isMfaLoading}
          />

          {/* Tarjeta de Cambio de Contraseña */}
          <PasswordChangeCard
            currentPassword={sec.currentPassword}
            setCurrentPassword={sec.setCurrentPassword}
            newPassword={sec.newPassword}
            setNewPassword={sec.setNewPassword}
            confirmPassword={sec.confirmPassword}
            setConfirmPassword={sec.setConfirmPassword}
            isChangingPassword={sec.isChangingPassword}
            passwordSuccess={sec.passwordSuccess}
            passwordError={sec.passwordError}
            strength={sec.strength}
            handlePasswordSubmit={sec.handlePasswordSubmit}
          />
        </div>

        {/* Modales de 2FA */}
        <MfaModal
          isOpen={sec.isMfaModalOpen}
          onClose={handleMfaModalClose}
          triggerRef={sec.mfaTriggerRef}
          mfaData={sec.mfaData}
          onVerify={sec.handleVerifyMfa}
          isLoading={sec.isMfaLoading}
          mfaMessage={sec.mfaMessage}
          backupCodes={sec.backupCodes}
        />

        <DisableMfaModal
          isOpen={sec.isDisableMfaModalOpen}
          onClose={() => sec.setIsDisableMfaModalOpen(false)}
          triggerRef={sec.disableMfaTriggerRef}
          onDisable={sec.handleDisableMfa}
          isLoading={sec.isMfaLoading}
          mfaMessage={sec.mfaMessage}
        />
      </div>
  );
}
