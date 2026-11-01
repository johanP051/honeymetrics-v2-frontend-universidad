import React from 'react';
import { X, Trash2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useModalA11y } from '../../hooks/useModalA11y';

export default function DeleteUserModal({
  isOpen,
  onClose,
  triggerRef,
  userToDelete,
  onConfirm,
  isLoading,
}) {
  const modalRef = useModalA11y({ isOpen, onClose, triggerRef, isLoading });

  if (!isOpen || !userToDelete) return null;

  const handleConfirm = async () => {
    await onConfirm(userToDelete.id);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-hm-card border border-hm-border rounded-xl shadow-2xl p-5 sm:p-6 text-hm-text"
      >
        <div className="flex items-center justify-between border-b border-hm-border/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Trash2 size={20} className="text-hm-danger" aria-hidden="true" />
            <h2 id="delete-user-title" className="text-base font-bold text-hm-text">
              Eliminar Usuario del Sistema
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Cerrar diálogo"
            className="p-1 rounded-lg text-hm-muted hover:text-hm-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-hm-muted">
            ¿Está seguro de que desea eliminar permanentemente al usuario{' '}
            <strong className="text-hm-text">{userToDelete.email}</strong>? Esta acción no se puede deshacer.
          </p>

          {userToDelete.is_mfa_enabled && (
            <div className="p-3 rounded-lg bg-hm-warning/10 border border-hm-warning/30 text-hm-warning flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Usuario con 2FA Activo</p>
                <p className="text-[11px] mt-0.5">
                  Se revocarán automáticamente en cascada sus secretos TOTP, códigos de respaldo y tokens de sesión.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-hm-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-lg border border-hm-border text-hm-muted hover:text-hm-text"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-4 py-1.5 rounded-lg bg-hm-danger text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Eliminando...' : 'Eliminar Usuario'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
