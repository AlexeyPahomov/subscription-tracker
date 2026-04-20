import { useBodyLockClass } from '@/hooks/useBodyLockClass';

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
}
