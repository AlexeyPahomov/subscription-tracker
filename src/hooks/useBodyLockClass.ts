import { useEffect } from 'react';

type UseBodyLockClassParams = {
  isActive: boolean;
  className: string;
};

/**
 * Блокирует скролл body и выставляет служебный класс, пока слой открыт.
 */
export function useBodyLockClass({ isActive, className }: UseBodyLockClassParams) {
  useEffect(() => {
    if (!isActive) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.body.classList.add(className);

    return () => {
      document.body.style.overflow = overflow;
      document.body.classList.remove(className);
    };
  }, [isActive, className]);
}
