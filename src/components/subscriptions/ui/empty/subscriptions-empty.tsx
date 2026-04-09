'use client';

import { Button } from '@gravity-ui/uikit';

type SubscriptionsEmptyProps = {
  onAdd: () => void;
};

export function SubscriptionsEmpty({ onAdd }: SubscriptionsEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-5 rounded-xl border-gray-700 px-4 py-14 text-center">
      <p className="text-lg text-gray-300">You have no subscriptions yet</p>
      <Button view="action" size="l" onClick={onAdd}>
        Add your first subscription
      </Button>
    </div>
  );
}
