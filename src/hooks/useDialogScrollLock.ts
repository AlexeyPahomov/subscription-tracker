import { useBodyLockClass } from '@/hooks/useBodyLockClass';

/**
 * Единая блокировка фонового скролла для Gravity UI Dialog.
 * Не трогаем overflow html/body, чтобы не ломать sticky-header;
 * блокируем только wheel/touch вне слоя `.g-modal`.
 */
export function useDialogScrollLock(isOpen: boolean) {
  useBodyLockClass({
    isActive: isOpen,
    className: 'dialog-open',
    lockHtml: false,
    lockBody: false,
    preventScrollEvents: true,
    allowScrollWithinSelector: '.g-modal',
  });
}
