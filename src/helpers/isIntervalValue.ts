import { subscriptionIntervals } from '@/components/subscriptions/ui/forms/constants';
import type { IntervalValue } from '@/types/subscription';

const INTERVAL_VALUES = subscriptionIntervals.map(
  (item) => item.value,
) as readonly IntervalValue[];

export function isIntervalValue(value: string): value is IntervalValue {
  return (INTERVAL_VALUES as readonly string[]).includes(value);
}
