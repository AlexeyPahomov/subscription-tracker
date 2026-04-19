'use client';

import { Button } from '@gravity-ui/uikit';

type SubscriptionsEmptyProps = {
  onAdd: () => void;
};

export function SubscriptionsEmpty({ onAdd }: SubscriptionsEmptyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-start gap-5 rounded-xl border border-neutral-200 bg-neutral-50/40 px-4 py-14 text-center dark:border-gray-700 dark:bg-transparent">
      <p className="text-lg text-neutral-800 dark:text-gray-300">
        You have no subscriptions yet
      </p>
      <Button view="action" size="l" onClick={onAdd}>
        Add your first subscription
      </Button>
    </div>
  );
}
