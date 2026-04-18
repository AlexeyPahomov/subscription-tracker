'use client';

import type { IntervalValue, Subscription } from '@/types/subscription';
import { SubscriptionCard } from '@/components/subscriptions/ui/card/subscription-card';
import { subscriptionIntervals } from '@/components/subscriptions/ui/forms';

function getIntervalLabel(value: IntervalValue): string {
  return (
    subscriptionIntervals.find((interval) => interval.value === value)?.label ??
    value
  );
}

type SubscriptionsListProps = {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
};

export function SubscriptionsList({
  subscriptions,
  onEdit,
  onDelete,
}: SubscriptionsListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {subscriptions.map((subscription, index) => (
        <SubscriptionCard
          key={subscription.id}
          subscriptionId={subscription.id}
          name={subscription.name}
          price={subscription.price}
          interval={getIntervalLabel(subscription.interval)}
          nextPaymentDate={subscription.nextPaymentDate}
          category={subscription.category}
          brandIndex={index}
          onEdit={() => onEdit(subscription)}
          onDelete={() => onDelete(subscription.id)}
        />
      ))}
    </div>
  );
}
