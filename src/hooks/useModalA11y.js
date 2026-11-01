import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * useModalA11y
 * Implements WCAG 2.2 AA compliant modal accessibility:
 * - Traps focus cyclically on Tab and Shift+Tab
 * - Auto-focuses the first focusable element or modal container on mount
 * - Dismisses modal on Escape key
 * - Restores focus to the trigger element on close/unmount
 */
export function useModalA11y({
  isOpen,
  onClose,
  triggerRef,
  isLoading = false,
  containerRef,
}) {
  const localRef = useRef(null);
  const targetRef = containerRef || localRef;
  const previousFocusRef = useRef(null);
  const handlersRef = useRef({ onClose, isLoading });
  handlersRef.current = { onClose, isLoading };

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;

    const modal = targetRef.current;
    if (modal) {
      const focusable = modal.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length > 0) {
        requestAnimationFrame(() => {
          focusable[0]?.focus();
        });
      } else {
        modal.focus();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!handlersRef.current.isLoading && handlersRef.current.onClose) {
          e.preventDefault();
          handlersRef.current.onClose();
        }
        return;
      }

      if (e.key !== 'Tab') return;

      const currentModal = targetRef.current;
      if (!currentModal) return;

      const focusableElements = Array.from(currentModal.querySelectorAll(FOCUSABLE_SELECTOR));
      if (focusableElements.length === 0) {
        e.preventDefault();
        currentModal.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || !currentModal.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement || !currentModal.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const restoreTarget = triggerRef?.current || previousFocusRef.current;
      if (restoreTarget && typeof restoreTarget.focus === 'function') {
        requestAnimationFrame(() => {
          restoreTarget.focus();
        });
      }
    };
  }, [isOpen, triggerRef, targetRef]);

  return targetRef;
}

export default useModalA11y;
