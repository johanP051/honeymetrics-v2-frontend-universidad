import React from 'react';
import { createPortal } from 'react-dom';
import { X, AlertTriangle, Trash2, Loader2 } from 'lucide-react';

export default function DeleteUserModal({ isOpen, onClose, userToDelete, onConfirm, isLoading }) {
  if (!isOpen || !userToDelete) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm overflow-hidden p-4">
      <div className="glass-card w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative border border-hm-danger/40 shadow-[0_0_30px_rgba(208,107,98,0.2)]">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-hm-muted hover:text-hm-danger transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-hm-danger/10 border border-hm-danger/30 text-hm-danger">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-hm-danger">Eliminar Usuario</h3>
            <p className="text-xs text-hm-muted">Confirmación crítica requerida (PB-HM-20)</p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-hm-danger/5 border border-hm-danger/20 mb-5">
          <p className="text-xs text-hm-text leading-relaxed">
            ¿Estás seguro de que deseas eliminar permanentemente la cuenta de{' '}
            <strong className="text-hm-gold font-mono">{userToDelete.email}</strong>?
          </p>
          <p className="text-[11px] text-hm-muted mt-2">
            Esta acción revocará de inmediato cualquier token activo y purgará los registros asociados. Esta operación no se puede deshacer.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm text-hm-muted hover:bg-hm-elevated hover:text-hm-text transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(userToDelete.id)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-hm-danger text-white font-bold rounded-lg hover:bg-red-600 transition-colors shadow-[0_0_15px_rgba(208,107,98,0.3)] text-sm disabled:opacity-50"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            <Trash2 size={15} />
            <span>{isLoading ? 'Eliminando...' : 'Eliminar Definitivamente'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
