import type { DateTime } from '@gravity-ui/date-utils';

export type IntervalValue = 'monthly' | 'yearly' | 'weekly' | 'quarterly';

export type IntervalOption = {
  value: IntervalValue;
  label: string;
};

export type SubscriptionFormValues = {
  name: string;
  price: string;
  interval: IntervalValue | null;
  nextPaymentDate: DateTime | null;
};
