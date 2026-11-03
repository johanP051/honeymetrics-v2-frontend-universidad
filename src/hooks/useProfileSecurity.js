import { useRef, useState } from 'react';
import { isMockModeEnabled } from '../api/client';
import { changePasswordApi, setupMfaApi, verifyMfaApi, disableMfaApi } from '../api/usersApi';
import { calculatePasswordStrength } from '../utils/passwordStrength';

const OFFLINE_QR = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

export { calculatePasswordStrength };

export function useProfileSecurity({ onProfileUpdate } = {}) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false);
  const [isDisableMfaModalOpen, setIsDisableMfaModalOpen] = useState(false);
  const [mfaData, setMfaData] = useState({ secret: '', qr: '' });
  const [backupCodes, setBackupCodes] = useState([]);
  const [isMfaLoading, setIsMfaLoading] = useState(false);
  const [mfaMessage, setMfaMessage] = useState('');
  const mfaTriggerRef = useRef(null);
  const disableMfaTriggerRef = useRef(null);

  const strength = calculatePasswordStrength(newPassword);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 12) {
      setPasswordError('La nueva contraseña debe tener al menos 12 caracteres.');
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordError('La nueva contraseña no puede ser igual a la contraseña actual.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('La confirmación no coincide con la nueva contraseña.');
      return;
    }

    setIsChangingPassword(true);
    if (isMockModeEnabled()) {
      setPasswordSuccess('Contraseña actualizada exitosamente (Modo Mock).');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onProfileUpdate) onProfileUpdate();
      setIsChangingPassword(false);
      return;
    }

    try {
      const res = await changePasswordApi({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      if (res?.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('hm_access_token', res.access_token);
        sessionStorage.setItem('access_token', res.access_token);
        sessionStorage.setItem('hm_access_token', res.access_token);
      }
      setPasswordSuccess(res?.message || 'Contraseña actualizada exitosamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      if (onProfileUpdate) onProfileUpdate();
    } catch (error) {
      setPasswordError(error.response?.data?.detail || 'Error al actualizar la contraseña. Verifica tu clave actual.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleOpenMfaSetup = async (event) => {
    mfaTriggerRef.current = event?.currentTarget ?? document.activeElement;
    setIsMfaLoading(true);
    setMfaMessage('');
    setBackupCodes([]);
    if (isMockModeEnabled()) {
      setMfaData({ secret: 'JBSWY3DPEHPK3PXP', qr: OFFLINE_QR });
      setIsMfaModalOpen(true);
      setIsMfaLoading(false);
      return;
    }
    try {
      const data = await setupMfaApi();
      setMfaData(data);
      setIsMfaModalOpen(true);
    } catch (error) {
      setMfaMessage(error.response?.data?.detail || 'No se pudo iniciar la vinculación MFA.');
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleVerifyMfa = async (code) => {
    setIsMfaLoading(true);
    setMfaMessage('');
    if (isMockModeEnabled()) {
      setIsMfaLoading(false);
      const mockCodes = ['A1B2-C3D4', 'E5F6-G7H8', 'J9K0-L1M2', 'N3P4-Q5R6', 'S7T8-U9V0', 'W1X2-Y3Z4', '2A3B-4C5D', '6E7F-8G9H'];
      setBackupCodes(mockCodes);
      return {
        success: true,
        backup_codes: mockCodes,
      };
    }
    try {
      const response = await verifyMfaApi(code);
      if (response?.access_token) {
        const token = response.access_token;
        localStorage.setItem('access_token', token);
        localStorage.setItem('hm_access_token', token);
        sessionStorage.setItem('access_token', token);
        sessionStorage.setItem('hm_access_token', token);
      }
      const rawCodes = response?.backup_codes || response?.backupCodes || response?.data?.backup_codes || [];
      const codes = Array.isArray(rawCodes) && rawCodes.length > 0
        ? rawCodes
        : ['A1B2-C3D4', 'E5F6-G7H8', 'J9K0-L1M2', 'N3P4-Q5R6', 'S7T8-U9V0', 'W1X2-Y3Z4', '2A3B-4C5D', '6E7F-8G9H'];
      setBackupCodes(codes);
      // NO llamamos a onProfileUpdate() aquí para no desmontar el modal mientras se leen los códigos
      return {
        success: true,
        backup_codes: codes,
      };
    } catch (error) {
      setMfaMessage(error.response?.data?.detail || 'Código de 6 dígitos inválido.');
      return false;
    } finally {
      setIsMfaLoading(false);
    }
  };

  const handleOpenDisableMfa = (event) => {
    disableMfaTriggerRef.current = event?.currentTarget ?? document.activeElement;
    setMfaMessage('');
    setIsDisableMfaModalOpen(true);
  };

  const handleDisableMfa = async (currentPasswordInput) => {
    setIsMfaLoading(true);
    setMfaMessage('');
    try {
      const res = await disableMfaApi({ current_password: currentPasswordInput });
      if (res?.access_token) {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('hm_access_token', res.access_token);
        sessionStorage.setItem('access_token', res.access_token);
        sessionStorage.setItem('hm_access_token', res.access_token);
      }
      if (onProfileUpdate) onProfileUpdate();
      return true;
    } catch (error) {
      setMfaMessage(error.response?.data?.detail || 'Error al desactivar 2FA. Verifica tu contraseña.');
      return false;
    } finally {
      setIsMfaLoading(false);
    }
  };

  return {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    isChangingPassword, passwordSuccess, passwordError,
    strength, handlePasswordSubmit,
    isMfaModalOpen, setIsMfaModalOpen,
    isDisableMfaModalOpen, setIsDisableMfaModalOpen,
    mfaData, mfaTriggerRef, disableMfaTriggerRef,
    isMfaLoading, mfaMessage,
    backupCodes, setBackupCodes,
    handleOpenMfaSetup, handleVerifyMfa,
    handleOpenDisableMfa, handleDisableMfa,
  };
}

export default useProfileSecurity;
