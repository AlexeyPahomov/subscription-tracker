import { useEffect, type RefObject } from 'react';

type UseDismissibleLayerParams = {
  isOpen: boolean;
  containerRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
};

/**
 * Закрывает слой по клику вне контейнера и по Escape.
 */
export function useDismissibleLayer({
  isOpen,
  containerRef,
  onDismiss,
}: UseDismissibleLayerParams) {
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;
      if (!target || !containerRef.current?.contains(target)) {
        onDismiss();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onDismiss();
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, containerRef, onDismiss]);
}
