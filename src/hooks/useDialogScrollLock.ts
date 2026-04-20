import { useBodyLockClass } from '@/hooks/useBodyLockClass';
import { useEffect } from 'react';

const DIALOG_LOCK_CLASS = 'dialog-open';
const DIALOG_SCROLLABLE_SELECTOR = '.g-modal';

/**
 * Единая блокировка фонового скролла для Gravity UI Dialog.
 * Не трогаем overflow html/body, чтобы не ломать sticky-header;
 * блокируем только wheel/touch вне слоя `.g-modal`.
 */
export function useDialogScrollLock(isOpen: boolean) {
  useBodyLockClass({
    isActive: isOpen,
    className: DIALOG_LOCK_CLASS,
    lockHtml: false,
    lockBody: false,
    preventScrollEvents: true,
    allowScrollWithinSelector: DIALOG_SCROLLABLE_SELECTOR,
  });

  useEffect(() => {
    if (!isOpen) return;

    const header = document.querySelector('header');
    if (!header) return;

    const hadInert = header.hasAttribute('inert');
    if (!hadInert) {
      header.setAttribute('inert', '');
    }

    return () => {
      if (!hadInert) {
        header.removeAttribute('inert');
      }
    };
  }, [isOpen]);
}
