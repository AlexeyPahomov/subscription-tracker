'use client';

import { SquarePlus } from '@gravity-ui/icons';
import { Button, Icon } from '@gravity-ui/uikit';

type SubscriptionActionsProps = {
  onAdd: () => void;
};

export function SubscriptionActions({ onAdd }: SubscriptionActionsProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <Button view="action" onClick={onAdd}>
        <Icon data={SquarePlus} size={18} />
        Add subscription
      </Button>
    </div>
  );
}
