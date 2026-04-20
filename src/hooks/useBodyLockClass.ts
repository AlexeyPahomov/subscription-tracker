import { useEffect } from 'react';

type UseBodyLockClassParams = {
  isActive: boolean;
  className: string;
  lockHtml?: boolean;
  lockBody?: boolean;
  overflowValue?: 'clip' | 'hidden';
  preventScrollEvents?: boolean;
  allowScrollWithinSelector?: string;
};

/**
 * Блокирует скролл body и выставляет служебный класс, пока слой открыт.
 */
export function useBodyLockClass({
  isActive,
  className,
  lockHtml = true,
  lockBody = true,
  overflowValue = 'clip',
  preventScrollEvents = false,
  allowScrollWithinSelector,
}: UseBodyLockClassParams) {
  useEffect(() => {
    if (!isActive) return;

    const htmlOverflow = lockHtml ? document.documentElement.style.overflow : '';
    const bodyOverflow = lockBody ? document.body.style.overflow : '';

    if (lockHtml) {
      document.documentElement.style.overflow = overflowValue;
    }
    if (lockBody) {
      document.body.style.overflow = overflowValue;
    }
    document.body.classList.add(className);

    const shouldAllowTarget = (target: EventTarget | null) => {
      if (!allowScrollWithinSelector) return false;
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest(allowScrollWithinSelector));
    };

    const preventScroll = (event: WheelEvent | TouchEvent) => {
      if (shouldAllowTarget(event.target)) return;
      event.preventDefault();
    };

    const listenerOptions = { passive: false } as const;

    if (preventScrollEvents) {
      document.addEventListener('wheel', preventScroll, listenerOptions);
      document.addEventListener('touchmove', preventScroll, listenerOptions);
    }

    return () => {
      if (lockHtml) {
        document.documentElement.style.overflow = htmlOverflow;
      }
      if (lockBody) {
        document.body.style.overflow = bodyOverflow;
      }
      document.body.classList.remove(className);
      if (preventScrollEvents) {
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
      }
    };
  }, [
    isActive,
    className,
    lockHtml,
    lockBody,
    overflowValue,
    preventScrollEvents,
    allowScrollWithinSelector,
  ]);
}
