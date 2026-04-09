'use client';

import { Button, Icon } from '@gravity-ui/uikit';
import type { CardIconActionProps } from '../types';

export function CardIconAction({ icon, label, onClick }: CardIconActionProps) {
  return (
    <Button
      view="flat"
      size="s"
      type="button"
      onClick={onClick}
      aria-label={label}
    >
      <Icon data={icon} size={18} />
    </Button>
  );
}
