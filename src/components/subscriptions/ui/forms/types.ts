import type { DateTime } from '@gravity-ui/date-utils';
import type { IntervalValue } from '@/types/subscription';

export type IntervalOption = {
  value: IntervalValue;
  label: string;
};

export type SubscriptionFormValues = {
  name: string;
  price: string;
  interval: IntervalValue;
  nextPaymentDate: DateTime | null;
};
